require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH

module.exports = makeDeleteQuestion = ({ Quiz, QuizJson }) => {
	// Delete a question from the quiz file
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteQuestion(quizId, questionNumber) {
		return new Promise(async (resolve, reject) => {
			try {
				const quiz = await Quiz.findById(quizId)

				const quizPath = `${quizDir}${quiz.filename}`
				let quizData = await QuizJson.loadLocalQuiz(quizPath)
				delete quizData.questions[`${questionNumber}`]
				quizData = QuizJson.condenseOrdering(quizData)
				await QuizJson.saveLocalQuiz(quizPath, quizData)

				return resolve(true)
			} catch (err) {
				return reject(err)
			}
		})
	}
}
