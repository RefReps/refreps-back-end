module.exports = makeCopyContent = ({ Content, Module }) => {
	// Copy a content
	// Resolve -> content object
	// Reject -> error name
	return async function copyContent(contentId, bindModuleId, bindDocumentId) {
		return new Promise(async (resolve, reject) => {
			try {
				const content = await Content.findById(contentId)

				if (!content) {
					throw ReferenceError('Not Found')
				}

				const contentInfo = {
					name: content.name,
					toDocument: bindDocumentId,
					onModel: content.onModel,
					moduleId: bindModuleId,
					isPublished: content.isPublished,
					isKeepOpen: content.isKeepOpen,
					contentOrder: content.contentOrder,
					dropDate: content.dropDate,
				}

				const copyContent = new Content(contentInfo)

				const saved = await copyContent.save()

				// save the content id to the module
				const module_ = await Module.findOneAndUpdate(
					{ _id: bindModuleId },
					{ $push: { contents: saved._id } }
				)

				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
