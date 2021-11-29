module.exports = makeDeleteSection = ({ Section }) => {
	// Delete a section in the db
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteSection(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const course = await Section.findByIdAndDelete(id).exec()
				if (course == null) {
					return reject({ deleted: 0 })
				}
				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err.name)
			}
		})
	}
}
