const { ObjectId } = require('mongoose').Types

module.exports = makeFindCourseByQuizId = ({ Course, Content }) => {
	// Finds a course by an ObjectId
	// Resolve -> {course: object}
	// Reject -> error
	return async function findCourseByQuizId(quizId) {
		try {
			if (!quizId)
				throw new ReferenceError(
					'`quizId` in findCourseByQuizId was not provided.'
				)
			// Find content with quizId
			const contentDoc = await Content.findOne()
				.where('onModel')
				.equals('Quiz')
				.where('toDocument')
				.equals(quizId)
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
