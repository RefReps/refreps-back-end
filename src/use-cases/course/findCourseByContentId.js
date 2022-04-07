module.exports = makeFindCourseByContentId = ({ Course, Content }) => {
	// Finds a course by an ObjectId
	// Resolve -> {course: object}
	// Reject -> error
	return async function findCourseByContentId(contentId) {
		try {
			if (!contentId)
				throw new ReferenceError(
					'`contentId` in findCourseByQuizId was not provided.'
				)
			// Find content with quizId
			const contentDoc = await Content.findById(contentId)
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
			if (!contentDoc.moduleId.sectionId.courseId) {
				throw new Error('No course could be found')
			}

			const {
				moduleId: {
					sectionId: { courseId: course },
				},
			} = contentDoc.toObject({ flattenMaps: true })

			return Promise.resolve({ course })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
