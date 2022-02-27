module.exports = makeDeleteQuestions = ({ Quiz, QuizVersion }) => {
	// Delete a question batch from the quiz file
	// Resolve -> {Quiz: doc, QuizVersion: doc}
	// Rejects -> error
	return async function deleteQuestions(quizId, questionNumbers = []) {
		try {
			if (!(questionNumbers.length > 0))
				throw new Error(
					'`questionNumbers` must be greater than 0 in `deleteQuestions`.'
				)

			// Quiz exists
			const quiz = await Quiz.findById(quizId).populate('quizVersions').exec()
			if (!quiz) throw new ReferenceError('Quiz not found.')

			// Get oldQuizVersion and check if exists
			const oldQuizVersion = getActiveVersion(quiz)
			if (!oldQuizVersion)
				throw new ReferenceError(
					'`oldQuizVersion` not found in `deleteQuestions`.'
				)

			// Create a new QuizVersion based on the old QuizVersion
			const newQuizVersion = new QuizVersion({
				questions: collapseQuestions(
					removedQuestions(oldQuizVersion, questionNumbers)
				),
				versionNumber: oldQuizVersion.versionNumber + 1,
				quizSubmissions: [],
			})

			// Save new QuizVersion to the Quiz doc
			quiz.depopulate('quizVersions')
			quiz.quizVersions.push(newQuizVersion._id)
			quiz.markModified('quizVersions')
			quiz.activeVersion = newQuizVersion.versionNumber
			quiz.markModified('activeVersion')

			await quiz.save()
			await newQuizVersion.save()

			return Promise.resolve({
				quiz: quiz.toObject(),
				quizVersion: newQuizVersion.toObject(),
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

function getActiveVersion(quiz) {
	return quiz.quizVersions
		.filter((quizVersion) => quiz.activeVersion == quizVersion.versionNumber)
		.shift()
}

function removedQuestions(quizVersion, removeNumbers) {
	return quizVersion.questions.filter(
		(question) => !removeNumbers.includes(question.questionNumber)
	)
}

/**
 *
 * @param {[]} questions
 */
function collapseQuestions(questions) {
	questions = questions.sort((q1, q2) => {
		return q1.questionNumber - q2.questionNumber
	})
	let currentQuestionNum = 0
	questions = questions.map((q) => {
		currentQuestionNum++
		return Object.assign({}, q.toObject(), {
			questionNumber: currentQuestionNum,
		})
	})
	return questions
}
