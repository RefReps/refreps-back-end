module.exports = makeFindModuleById = ({ Module }) => {
	// Finds a module by an ObjectId
	// Resolve -> {module Object}
	// Reject -> error
	return async function findModuleById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = {}

				const doc = await Module.findById(id).where(query).exec()
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
