module.exports = makeFindSectionById = ({ Section }) => {
	// Finds a section by an ObjectId
	// Resolve -> {section Object}
	// Reject -> error
	return async function findSectionById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = {}

				const doc = await Section.findById(id).where(query).exec()
				if (doc == null) {
					return resolve({})
				}
				const found = doc.toObject()

				return resolve(found)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
