module.exports = makeUpdateContent = ({ Content }) => {
	// Updates an existing content
	// Resolve -> {count: #, content: {contentObject}}
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the course are
	// not updated. That is handled inside of the controller that uses this function.
	return async function updateContent(id, contentInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				if (!id) {
					throw new ReferenceError('`id` is required')
				}

				const updated = await Content.findByIdAndUpdate(
					id,
					contentInfo,
					options
				).exec()
				if (updated == null) {
					return resolve({ count: 0, content: {} })
				}
				return resolve({ count: 1, content: updated.toObject() })
			} catch (error) {
				return reject(error)
			}
		})
	}
}
