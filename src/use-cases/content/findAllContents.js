module.exports = makeFindAllContents = ({ Content }) => {
	// Finds all contents in the db
	// Options: publishedOnly -> Find only published contents (default: true)
	// Resolve -> {found: #, contents: {object}}
	// Reject -> error
	return async function findAllContents(
		moduleId,
		{ publishedOnly = true } = {}
	) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!moduleId) {
					throw new ReferenceError('moduleId is undefined')
				}

				let query = {}
				query['moduleId'] = moduleId
				if (publishedOnly) {
					query['isPublished'] = true
				}

				const contentQuery = Content.find(query)

				contentQuery.sort({ contentOrder: 1, _id: 1 })
				const contentDocs = await contentQuery.exec()

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
