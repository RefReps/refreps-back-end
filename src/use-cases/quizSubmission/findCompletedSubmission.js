module.exports = makeFindCompletedSubmission = ({ QuizSubmission }) => {
	/**
	 * @returns {userId, submissionId, quizId, submissionNumber, grade, userAnswers, quizQuestions, quizVersionNumber, dateStarted, dateFinished,}
	 */
	return async function findCompletedSubmission(submissionId) {
		try {
			if (!submissionId)
				throw new ReferenceError('`submissionId` must be provided.')

			const submission = await QuizSubmission.findById(submissionId)
				.populate('quizVersionId')
				.exec()
			if (!submission) throw new ReferenceError('Submission doc not found.')

			if (submission.submitted != true)
				throw new ReferenceError('Submission is not yet submitted.')

			if (!submission.quizVersionId)
				throw new ReferenceError('Quiz Version doc not found.')

			return Promise.resolve({
				userId: submission.userId,
				submissionId: submission._id,
				quizId: submission.quizId,
				submissionNumber: submission.submissionNumber,
				grade: submission.grade,
				userAnswers: submission.userAnswers,
				answerOverrides: submission.answerOverrides,
				quizQuestions: submission.quizVersionId.questions,
				quizVersionNumber: submission.quizVersionId.versionNumber,
				dateStarted: submission.dateStarted,
				dateFinished: submission.dateFinished,
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
