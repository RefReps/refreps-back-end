module.exports = makeCopyQuiz = ({ Quiz, QuizVersion }) => {
	// Copy a quiz
	// Resolve -> quiz object
	// Reject -> error name
	return async function copyQuiz(quizId) {
		try {
			const oldQuiz = await Quiz.findById(quizId)
				.populate('quizVersions')
				.exec()
			if (!oldQuiz) throw ReferenceError('Quiz not found to copy.')

			// Get latest quizVersion on oldQuiz.quizVersions
			const latestQuizVersionDoc = getActiveVersion(oldQuiz)
			if (!latestQuizVersionDoc) throw ReferenceError('QuizVersion not found.')

			// Create new QuizVersion for the new Quiz
			const newQuizVersion = new QuizVersion({
				questions: latestQuizVersionDoc.questions,
				versionNumber: 1,
				quizSubmissions: [],
			})
			await newQuizVersion.save()

			// Save old quiz contents in new quiz
			const newQuiz = new Quiz({
				name: oldQuiz.name,
				quizVersions: [newQuizVersion._id],
				activeVersion: newQuizVersion.versionNumber,
			})
			await newQuiz.save()

			return Promise.resolve({ quiz: newQuiz.toObject() })
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

function getActiveVersion(quiz) {
	return quiz.quizVersions
		.filter((quizVersion) => quiz.activeVersion == quizVersion.versionNumber)
		.shift()
}
