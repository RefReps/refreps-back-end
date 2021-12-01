module.exports = makeFindAllModules = ({ Module }) => {
	// Finds all modules in the db
	// Options: publishedOnly -> Find only published modules (default: true)
	// Resolve -> {found: #, modules: {object}}
	// Reject -> error
	return async function findAllModules(
		sectionId,
		{ publishedOnly = true } = {}
	) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!sectionId) {
					throw new ReferenceError('sectionId is undefined')
				}

				let query = {}
				query['sectionId'] = sectionId
				if (publishedOnly) {
					query['isPublished'] = true
				}

				const moduleQuery = Module.find(query)

				moduleQuery.sort({ moduleOrder: 1, _id: 1 })
				const moduleDocs = await moduleQuery.exec()

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
