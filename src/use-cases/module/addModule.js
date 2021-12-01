module.exports = makeAddModule = ({ Module }) => {
	// Save a new module in the db
	// Resolve -> module object
	// Reject -> error
	return async function addModule(moduleInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const module = new Module(moduleInfo)
			try {
				const saved = await module.save()
				return resolve(saved.toObject())
			} catch (error) {
				return reject(error)
			}
		})
	}
}
