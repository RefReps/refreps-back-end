module.exports = makeDeleteContent = ({ Content, Module }) => {
	// Delete a content in the db
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteContent(id) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }

			try {
				const content = await Content.findByIdAndDelete(id).exec()
				if (content == null) {
					return reject({ deleted: 0 })
				}

				// Remove content from module.contents
				const module = await Module.findByIdAndUpdate(content.moduleId, {
					$pull: { contents: content._id },
					options,
				})

				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
