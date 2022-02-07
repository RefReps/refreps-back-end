// QuizSubmission: mongoose model
module.exports = makeGetSubmissionGrade = ({ QuizSubmission }) => {
	// Get the grade of a user
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function getSubmissionGrade(quizId, userId) {
		return new Promise(async (resolve, reject) => {
			try {
				// Find the quiz in progress
				const submissionInProgress = await QuizSubmission.findOne()
					.where('userId')
					.equals(userId)
					.where('quizId')
					.equals(quizId)
					.where('submitted')
					.equals(true)
					.sort('dateFinished')
					.exec()
				if (!submissionInProgress) {
					throw new Error('Could not find submission for user')
				}

				const result = { userId, grade: submissionInProgress.grade }

				return resolve(result)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
