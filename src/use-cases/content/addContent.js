module.exports = makeAddContent = ({ Content, Module }) => {
	// Save a new content in the db
	// Resolve -> content object
	// Reject -> error name
	return async function addContent(contentInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }

			const info = Object.assign({
				dropDate: new Date(),
			}, {...contentInfo})

			const content = new Content(info)
			try {
				await content.validate()

				// Add content to module.contents
				const module = await Module.findByIdAndUpdate(
					contentInfo.moduleId,
					{ $push: { contents: content._id } },
					options
				)
				// if (module == null) {
				// 	throw ReferenceError('Module not found.')
				// }

				const saved = await content.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
