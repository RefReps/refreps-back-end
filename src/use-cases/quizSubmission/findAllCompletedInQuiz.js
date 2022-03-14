module.exports = makeFindAllCompletedInQuiz = ({ QuizSubmission }) => {
	/**
	 * @returns {submissions: [{userId, submissionId, quizId, submissionNumber, grade, userAnswers, quizQuestions, quizVersionNumber, dateStarted, dateFinished,}]}
	 */
	return async function findAllCompletedInQuiz(quizId, userId) {
		try {
			if (!quizId) throw new ReferenceError('`quizId` must be provided.')

			const submissions = await QuizSubmission.find()
				.where('quizId')
				.equals(quizId)
				.where('userId')
				.equals(userId)
				.populate('quizVersionId')
				.exec()

			const results = []
			for (const submission of submissions) {
				if (submission.submitted != true) continue
				if (!submission.quizVersionId) continue
				results.push({
					userId: submission.userId,
					submissionId: submission._id,
					quizId: submission.quizId,
					submissionNumber: submission.submissionNumber,
					grade: submission.grade,
					userAnswers: submission.userAnswers,
					quizQuestions: submission.quizVersionId.questions,
					quizVersionNumber: submission.quizVersionId.versionNumber,
					dateStarted: submission.dateStarted,
					dateFinished: submission.dateFinished,
				})
			}

			return Promise.resolve({ submissions: results })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
