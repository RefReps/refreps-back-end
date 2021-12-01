module.exports = makeDeleteSection = ({ Section }) => {
	// Delete a section in the db
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteSection(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const section = await Section.findByIdAndDelete(id).exec()
				if (section == null) {
					return reject({ deleted: 0 })
				}
				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
