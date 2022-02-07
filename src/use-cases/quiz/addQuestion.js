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
				return reject(new ReferenceError('Quiz not found'))
			}

			questionData = stripQuestionData(questionData)

			// Incoming question is valid
			if (!QuizJson.validateQuizQuestionData(questionData)) {
				return reject(new TypeError('Question data is not valid'))
			}

			// Save questionData
			const quizPath = `${QuizJson.localPath}${quiz.filename}`

			try {
				let quizData = await QuizJson.loadLocalQuiz(quizPath)
				quizData.questions[`${questionNumber}`] = questionData
				quizData = QuizJson.condenseOrdering(quizData)
				await QuizJson.saveLocalQuiz(quizPath, quizData)
			} catch (err) {
				reject(err)
			}
			return resolve(true)
		})
	}
}

const stripQuestionData = (data) => {
	switch (data.type) {
		case '1_CHOICE':
			return Object.assign(
				{},
				{
					type: data.type,
					question: data.question,
					responses: data.responses,
					answers: data.answers,
				}
			)
		case 'MULTI_CHOICE':
			return Object.assign(
				{},
				{
					type: data.type,
					question: data.question,
					responses: data.responses,
					answers: data.answers,
				}
			)
		case 'TRUE_FALSE':
			return Object.assign(
				{},
				{
					type: data.type,
					question: data.question,
					answer: data.answer == 'true' ? true : false,
				}
			)
		case 'FREE_RESPONSE':
			return Object.assign(
				{},
				{
					type: data.type,
					question: data.question,
					answers: data.answers,
				}
			)
		default:
			return {}
	}
}
