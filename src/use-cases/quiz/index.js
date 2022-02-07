const Quiz = require('../../database/models/quiz.model')
const QuizSubmission = require('../../database/models/quizSubmission.model')
const QuizJson = require('../../utils/quiz/quizJson')

const makeAddQuestion = require('./addQuestion')
const makeAddQuiz = require('./addQuiz')
const makeCopyQuiz = require('./copyQuiz')
const makeDeleteQuestion = require('./deleteQuestion')
const makeFindQuizById = require('./findQuizById')
const makeGradeSubmission = require('./gradeSubmission')
const makeGetAllSubmissionGrades = require('./getAllSubmissionGrades')
const makeGetSubmissionGrade = require('./getSubmissionGrade')
const makeSaveAnswersInSubmission = require('./saveAnswersInSubmission')
const makeStartQuiz = require('./startQuiz')

const addQuestion = makeAddQuestion({ Quiz, QuizJson })
const addQuiz = makeAddQuiz({ Quiz, QuizJson })
const copyQuiz = makeCopyQuiz({ Quiz, QuizJson })
const deleteQuestion = makeDeleteQuestion({ Quiz, QuizJson })
const findQuizById = makeFindQuizById({ Quiz, QuizJson })
const gradeSubmission = makeGradeSubmission({ Quiz, QuizJson, QuizSubmission })
const getAllSubmissionGrades = makeGetAllSubmissionGrades({ QuizSubmission })
const getSubmissionGrade = makeGetSubmissionGrade({ QuizSubmission })
const saveAnswersInSubmission = makeSaveAnswersInSubmission({ QuizSubmission })
const startQuiz = makeStartQuiz({ Quiz, QuizSubmission, QuizJson })

module.exports = {
	addQuestion,
	addQuiz,
	copyQuiz,
	deleteQuestion,
	findQuizById,
	gradeSubmission,
	getAllSubmissionGrades,
	getSubmissionGrade,
	saveAnswersInSubmission,
	startQuiz,
}
