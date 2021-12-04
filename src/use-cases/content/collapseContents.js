module.exports = makeCollapseContents = ({ Content }) => {
	// Collapses all contents contentOrder(s) in the db
	// Resolve -> {found: #, contents: [content objects]}
	// Reject -> error
	return async function collapseContents(moduleId) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!moduleId) {
					throw new ReferenceError('moduleId is undefined')
				}

				let query = {}
				query['moduleId'] = moduleId

				const contentQuery = Content.find(query)

				// Sort the query by the following: contentOrder->name->_id
				contentQuery.sort({ contentOrder: 1, name: 1, _id: 1 })
				const contentDocs = await contentQuery.exec()

				if (isDocsEmpty(contentDocs)) {
					return resolve({
						found: 0,
						contents: [],
					})
				}

				decreaseToLowestNumber(contentDocs, 'contentOrder', 1)

				const totalDocs = contentDocs.length
				if (totalDocs > 1) {
					fixDuplicates(contentDocs, 'contentOrder')
					fixGaps(contentDocs, 'contentOrder')
				}

				// Update all docs
				for (let i = 0; i < totalDocs; i++) {
					await Content.findByIdAndUpdate(contentDocs[i]._id, {
						contentOrder: contentDocs[i].contentOrder,
					}).exec()
				}

				let contentObjects = []
				contentDocs.forEach((doc) => {
					contentObjects.push(doc.toObject())
				})
				return resolve({
					found: contentObjects.length,
					contents: contentObjects,
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

// Find any gaps in the content and decrease those contentOrder(s) by 1
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