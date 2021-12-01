module.exports = makeCollapseModules = ({ Module }) => {
	// Collapses all modules moduleOrder(s) in the db
	// Resolve -> {found: #, modules: [modules objects]}
	// Reject -> error
	return async function collapseModules(sectionId) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!sectionId) {
					throw new ReferenceError('sectionId is undefined')
				}

				let query = {}
				query['sectionId'] = sectionId

				const moduleQuery = Module.find(query)

				// Sort the query by the following: moduleOrder->name->_id
				moduleQuery.sort({ moduleOrder: 1, name: 1, _id: 1 })
				const moduleDocs = await moduleQuery.exec()

				if (isDocsEmpty(moduleDocs)) {
					return resolve({
						found: 0,
						modules: [],
					})
				}

				decreaseToLowestNumber(moduleDocs, 'moduleOrder', 1)

				const totalDocs = moduleDocs.length
				if (totalDocs > 1) {
					fixDuplicates(moduleDocs, 'moduleOrder')
					fixGaps(moduleDocs, 'moduleOrder')
				}

				// Update all docs
				for (let i = 0; i < totalDocs; i++) {
					await Module.findByIdAndUpdate(moduleDocs[i]._id, {
						moduleOrder: moduleDocs[i].moduleOrder,
					}).exec()
				}

				let moduleObjects = []
				moduleDocs.forEach((doc) => {
					moduleObjects.push(doc.toObject())
				})
				return resolve({
					found: moduleObjects.length,
					modules: moduleObjects,
				})
			} catch (error) {
				return reject(error)
			}
		})
	}
}

const isDocsEmpty = (docs) => {
	if (!docs[0]) {
		return true
	}
	return false
}

// decrease each doc's attribute down a number until the first doc has attribute=1
// param: docs -> array of docs
// param: attribute -> string of an attribute in the docs
// param: lowestNumber -> int of the lowest number desired
const decreaseToLowestNumber = (docs, attribute, lowestNumber) => {
	while (docs[0][attribute] > lowestNumber) {
		docs.forEach((doc) => {
			doc[attribute] -= 1
		})
	}
}

// Find duplicate attribute values and fix by adding 1 to duplicate and remaining docs
// (Loop through first to second last)
// param: docs -> array of docs
// param: attribute -> string of an attribute in the docs
const fixDuplicates = (docs, attribute) => {
	const totalDocs = docs.length
	for (let i = 0; i < totalDocs - 1; i++) {
		if (docs[i][attribute] == docs[i + 1][attribute]) {
			for (let j = i + 1; j < totalDocs; j++) {
				docs[j][attribute] += 1
			}
		}
	}
}

// Find any gaps in the docs and decrease those attributes(s) by 1
// (Loop 2nd through last)
// param: docs -> array of docs
// param: attribute -> string of an attribute in the docs
const fixGaps = (docs, attribute) => {
	const totalDocs = docs.length
	for (let i = 1; i < totalDocs; i++) {
		const previous = i - 1
		while (docs[i][attribute] != docs[previous][attribute] + 1) {
			docs[i][attribute] -= 1
		}
	}
}
