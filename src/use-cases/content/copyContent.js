module.exports = makeCopyContent = ({ Content }) => {
	// Copy a content
	// Resolve -> content object
	// Reject -> error name
	return async function copyContent(contentId, bindModuleId) {
		return new Promise(async (resolve, reject) => {
			try {
				const content = await Content.findById(contentId)

				if (!content) {
					throw ReferenceError('Not Found')
				}

				const contentInfo = Object.assign(
					{},
					{
						name: content.name,
						toDocument: content.toDocument,
						onModel: content.onModel,
						moduleId: bindModuleId,
						isPublished: content.isPublished,
						contentOrder: content.contentOrder,
						dropDate: content.dropDate,
					}
				)

				const copyContent = new Content(contentInfo)

				const saved = await copyContent.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
