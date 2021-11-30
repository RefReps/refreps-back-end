module.exports = makeUpdateSection = ({ Section }) => {
	// Updates an existing section
	// Resolve -> {count: #, section: {sectionObject}}
	// Rejects -> err

	// NOTE: this function does not ensure any specific parts of the course are
	// not updated. That is handled inside of the controller that uses this function.
	return async function updateSection(id, sectionInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				const updated = await Section.findByIdAndUpdate(
					id,
					sectionInfo,
					options
				).exec()
				if (updated == null) {
					resolve({ count: 0, section: {} })
				}
				return resolve({ count: 1, section: updated.toObject() })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
