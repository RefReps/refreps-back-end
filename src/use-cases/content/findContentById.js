module.exports = makeFindContentById = ({ Content }) => {
	// Finds a content by an ObjectId
	// Resolve -> {content Object}
	// Reject -> error
	return async function findContentById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = {}

				const doc = await Content.findById(id).where(query).exec()
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
