module.exports = makeDeleteContent = ({ Content }) => {
	// Delete a content in the db
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteContent(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const content = await Content.findByIdAndDelete(id).exec()
				if (content == null) {
					return reject({ deleted: 0 })
				}
				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
