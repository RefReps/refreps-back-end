const Quiz = require('../../database/models/quiz.model')
const QuizJson = require('../../utils/quiz/quizJson')

const makeAddQuestion = require('./addQuestion')
const makeAddQuiz = require('./addQuiz')
const makeFindQuizById = require('./findQuizById')

const addQuestion = makeAddQuestion({ Quiz, QuizJson })
const addQuiz = makeAddQuiz({ Quiz, QuizJson })
const findQuizById = makeFindQuizById({ Quiz, QuizJson })

module.exports = {
	addQuestion,
	addQuiz,
	findQuizById,
}
