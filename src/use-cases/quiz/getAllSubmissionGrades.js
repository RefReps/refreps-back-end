module.exports = makeGetAllSubmissionGrades = ({ Quiz, QuizSubmission }) => {
	// Get the grade of a user
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function getAllSubmissionGrades(quizId) {
		try {
			if (!quizId)
				throw new ReferenceError(
					'`quizId` must be provided in `getAllSubmissionGrades`.'
				)

			// Find the quiz in progress
			const submissions = await QuizSubmission.find()
				.where('quizId')
				.equals(quizId)
				.where('submitted')
				.equals(true)
				.sort('dateFinished')
				.populate('userId')
				.exec()

			const result = []
			submissions.forEach((submission) => {
				result.push({
					userId: submission.userId._id,
					email: submission.userId.email,
					grade: submission.grade,
					dateStarted: submission.dateStarted,
					dateFinished: submission.dateFinished,
				})
			})

			return Promise.resolve({ submissions: result })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
