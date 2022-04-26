module.exports = makeCollapseSections = ({ Section }) => {
	// Collapses all sections sectionOrder(s) in the db
	// Resolve -> {found: #, sections: [section objects]}
	// Reject -> error
	return async function collapseSections(courseId) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!courseId) {
					throw new ReferenceError('courseId is undefined')
				}

				// let query = {}
				// query['courseId'] = courseId

				// const sectionQuery = Section.find(query)

				// Sort the query by the following: sectionOrder->name->_id
				// sectionQuery.sort({ sectionOrder: 1, name: 1, _id: 1 })
				const sectionDocs = await Section.find()
					.where('courseId')
					.equals(courseId)
					.sort({ sectionOrder: 1, name: 1, _id: 1 })
					.exec()

				if (isDocsEmpty(sectionDocs)) {
					return resolve({
						found: 0,
						sections: [],
					})
				}

				// set sectionOrder to index ordering
				sectionDocs.forEach((doc, index) => {
					doc.sectionOrder = index + 1
				})

				// mongoose transaction to update all docs
				const transaction = await Section.collection.initializeUnorderedBulkOp()
				sectionDocs.forEach((doc) => {
					transaction.find({ _id: doc._id }).updateOne({ $set: { sectionOrder: doc.sectionOrder } })
				})
				await transaction.execute()

				let sectionObjects = []
				sectionDocs.forEach((doc) => {
					sectionObjects.push(doc.toObject())
				})
				return resolve({
					found: sectionObjects.length,
					sections: sectionObjects,
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

// Find any gaps in the section and decrease those sectionOrder(s) by 1
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

const fixZeros = (docs, attribute) => {
	const totalDocs = docs.length
	for (let i = 0; i < totalDocs; i++) {
		if (docs[i][attribute] == 0) {
			docs[i][attribute] = 1
		}
	}
}
