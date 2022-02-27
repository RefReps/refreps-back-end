// Quiz: mongoose model
module.exports = makeAddQuiz = ({ Quiz, QuizVersion }) => {
	// Save a new quiz in the db
	// Resolve -> quiz object
	// Reject -> error name
	return async function addQuiz(quizInfo = {}) {
		try {
			const quiz = new Quiz({
				name: 'New Quiz',
				quizVersions: [],
				activeVersion: 0,
				...quizInfo,
			})
			await quiz.validate()

			// TODO: Add initial quiz version in the quiz.quizVersions
			const initialVersion = new QuizVersion({
				questions: [],
				versionNumber: 1,
				quizSubmissions: [],
			})
			await initialVersion.save()

			// Set the initial quizVersion doc and active version
			quiz.activeVersion = initialVersion.versionNumber
			quiz.markModified('activeVersion')
			quiz.quizVersions.push(initialVersion._id)
			quiz.markModified('quizVersions')

			const saved = await quiz.save()
			return Promise.resolve({ quiz: saved.toObject() })
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
