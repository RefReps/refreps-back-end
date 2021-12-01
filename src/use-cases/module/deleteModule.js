module.exports = makeDeleteModule = ({ Module }) => {
	// Delete a module in the db
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteModule(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const module = await Module.findByIdAndDelete(id).exec()
				if (module == null) {
					return reject({ deleted: 0 })
				}
				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
