const Quiz = require('../../database/models/quiz.model')
const QuizSubmission = require('../../database/models/quizSubmission.model')
const QuizVersion = require('../../database/models/quizVersion.model')

const makeAddAnswer = require('./addAnswers')
const makeCreateSubmission = require('./createSubmission')
const makeFindAllCompletedInQuiz = require('./findAllCompletedInQuiz')
const makeFindCompletedSubmission = require('./findCompletedSubmission')
const makeFinishSubmission = require('./finishSubmission')

const addAnswer = makeAddAnswer({ QuizSubmission })
const createSubmission = makeCreateSubmission({ QuizSubmission })
const findAllCompletedInQuiz = makeFindAllCompletedInQuiz({ QuizSubmission })
const findCompletedSubmission = makeFindCompletedSubmission({ QuizSubmission })
const finishSubmission = makeFinishSubmission({ QuizSubmission })

module.exports = {
	addAnswer,
	// createSubmission,
	findAllCompletedInQuiz,
	findCompletedSubmission,
	finishSubmission,
}
