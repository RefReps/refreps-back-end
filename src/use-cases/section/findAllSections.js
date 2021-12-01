module.exports = makeFindAllSections = ({ Section }) => {
	// Finds all sections in the db
	// Options: publishedOnly -> Find only published sections (default: true)
	// Resolve -> {found: #, sections: {object}}
	// Reject -> error
	return async function findAllSections(
		courseId,
		{ publishedOnly = true } = {}
	) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!courseId) {
					throw new ReferenceError('courseId is undefined')
				}

				let query = {}
				query['courseId'] = courseId
				if (publishedOnly) {
					query['isPublished'] = true
				}

				const sectionQuery = Section.find(query)

				sectionQuery.sort({ sectionOrder: 1, _id: 1 })
				const sectionDocs = await sectionQuery.exec()

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
