module.exports = makeGetAllBestQuizzesInACourse = ({
	Quiz,
	QuizSubmission,
	Course,
	User,
}) => {
	// Get the grade of a user
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function getAllBestQuizzesInACourse(courseId, userId) {
		try {
			if (!courseId)
				throw new ReferenceError(
					'`courseId` must be provided in `getAllBestQuizzesInACourse`.'
				)

			// Find user
			const userDoc = await User.findById(userId).exec()
			const user = userDoc.toObject()

			// Find a course and get all quizzes
			const courseDoc = await Course.findById(courseId)
				.populate({
					path: 'sections',
					populate: {
						path: 'modules',
						populate: {
							path: 'contents',
							populate: {
								path: 'toDocument',
							},
						},
					},
				})
				.exec()

			// If no course is found, throw an error
			if (!courseDoc) {
				throw new ReferenceError('No course found.')
			}

			const course = courseDoc.toObject({ flattenMaps: true })

			// Get all quizzes from the course
			const quizzes = []
			course.sections.forEach((section) => {
				section.modules.forEach((module) => {
					module.contents.forEach((content) => {
						if (content.onModel == 'Quiz') {
							quizzes.push(content.toDocument)
						}
					})
				})
			})

			// Get best quiz submissions for each quiz on the user
			const result = []
			const bestQuizSubmissions = await Promise.all(
				quizzes.map(async (quiz) => {
					const quizSubmissions = await QuizSubmission.find({
						quizId: quiz._id,
						userId: userId,
					})
						.sort({ grade: -1, submissionNumber: -1 })
						.limit(1)
						.exec()
					if (quizSubmissions.length > 0) {
                        const submission = quizSubmissions[0].toObject()
						result.push({
							submissionId: submission._id,
							userId: userId,
							quizId: submission.quizId,
							email: user.email,
							grade: submission.grade,
							submissionNumber: submission.submissionNumber,
							dateStarted: submission.dateStarted,
							dateFinished: submission.dateFinished,
							isTaken: true,
						})
					} else {
						result.push({
							quizId: quiz._id,
							userId: userId,
							email: user.email,
							grade: 0,
							submissionNumber: 0,
							isTaken: false,
						})
					}
				})
			)

			return Promise.resolve({ submissions: result })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
