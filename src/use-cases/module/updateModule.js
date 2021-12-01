module.exports = makeUpdateModule = ({ Module }) => {
	// Updates an existing module
	// Resolve -> {count: #, module: {moduleObject}}
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the course are
	// not updated. That is handled inside of the controller that uses this function.
	return async function updateModule(id, moduleInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				if (!id) {
					throw new ReferenceError('`id` is required')
				}

				const updated = await Module.findByIdAndUpdate(
					id,
					moduleInfo,
					options
				).exec()
				if (updated == null) {
					return resolve({ count: 0, module: {} })
				}
				return resolve({ count: 1, module: updated.toObject() })
			} catch (error) {
				return reject(error)
			}
		})
	}
}
