// QuizSubmission: mongoose model
module.exports = makeGetSubmissionGrade = ({ QuizSubmission }) => {
	// Get the grade of a user
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function getSubmissionGrade(quizId) {
		return new Promise(async (resolve, reject) => {
			try {
				// Find the quiz in progress
				const submissionInProgress = await QuizSubmission.find()
					.where('quizId')
					.equals(quizId)
					.where('submitted')
					.equals(true)
					.sort('dateFinished')
					.exec()
				if (!submissionInProgress) {
					resolve([])
				}

				const result = []
				submissionInProgress.forEach((submission) => {
					result.push({
						userId: submission.userId,
						grade: submission.grade,
						dateStarted: submission.dateStarted,
						dateFinished: submission.dateFinished,
					})
				})

				return resolve(result)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
