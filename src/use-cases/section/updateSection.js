module.exports = makeUpdateSection = ({ Section }) => {
	// Updates an existing section
	// Resolve -> {count: #, section: {sectionObject}}
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the course are
	// not updated. That is handled inside of the controller that uses this function.
	return async function updateSection(id, sectionInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				if (!id) {
					throw new ReferenceError('`id` is required')
				}

				const updated = await Section.findByIdAndUpdate(
					id,
					sectionInfo,
					options
				).exec()
				if (updated == null) {
					return resolve({ count: 0, section: {} })
				}
				return resolve({ count: 1, section: updated.toObject() })
			} catch (error) {
				return reject(error)
			}
		})
	}
}
