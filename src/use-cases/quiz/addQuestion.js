require('dotenv').config({ path: '.env' })

module.exports = makeAddQuestion = ({ Quiz, QuizJson }) => {
	// Save a new question in the file based on db quiz location
	// Resolve -> question object
	// Reject -> error name
	return async function addQuestion(quizId, questionNumber, questionData = {}) {
		return new Promise(async (resolve, reject) => {
			// Quiz exists
			const quiz = await Quiz.findById(quizId)
			if (!quiz) {
				return reject(ReferenceError('Quiz not found'))
			}

			// Incoming question is valid
			if (!QuizJson.validateQuizQuestionData(questionData)) {
				return reject(TypeError('Question data is not valid'))
			}

			// Save questionData
			const quizPath = `${QuizJson.localPath}${quiz.filename}`
			await QuizJson.updateLocalQuiz(quizPath, { questionNumber: questionData })
			return resolve(true)
		})
	}
}
