module.exports = makeFindContentById = ({ Content, User }) => {
	// Finds a content by an ObjectId
	// Resolve -> {content Object}
	// Reject -> error
	return async function findContentById(contentId, userId) {
		try {
			const doc = await Content.findById(contentId)
				.populate({
					path: 'moduleId',
					populate: {
						path: 'sectionId',
						populate: {
							path: 'courseId',
						},
					},
				})
				.exec()
			if (doc == null) {
				throw new Error('Content not found')
			}
			const {
				moduleId: {
					sectionId: {
						courseId: { authors },
					},
				},
			} = doc.toObject()

			const user = await User.findById(userId).exec()

            // check if user is author
			if (
				!authors.find((author) => author._id.equals(userId)) &&
				!(user.role === 'admin')
			) {
                throw new Error('User is not author')
			}

			return Promise.resolve({ success: true })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
