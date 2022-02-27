const { validateQuestion } = require('../../utils/quiz/questionValidator')
const QuestionType = require('../../utils/enums/QuestionType.js')
const QuestionTypes = [
	QuestionType.CHOICE_1,
	QuestionType.FREE_RESPONSE,
	QuestionType.MULTI_CHOICE,
	QuestionType.TRUE_FALSE,
]

module.exports = makeAddQuestions = ({ Quiz, QuizVersion }) => {
	// Save a new question in the latest QuizVersion doc
	// Resolve -> {quiz: doc, quizVersion: doc}
	// Reject -> error name
	return async function addQuestions(quizId, questionDataList = []) {
		try {
			// Questions must be added
			if (!(questionDataList.length > 0))
				throw new Error(
					'`questionDataList` in `addQuestions` must not be empty.'
				)

			// Incoming questions are valid
			if (!validateAllQuestions(questionDataList))
				throw new TypeError(
					'`questionDataList` in `addQuestions` has invalid questions'
				)

			// Quiz exists
			const quiz = await Quiz.findById(quizId).populate('quizVersions').exec()
			if (!quiz) throw new ReferenceError('Quiz not found')

			// Get oldQuizVersion and check if exists
			const oldQuizVersion = getActiveVersion(quiz)
			if (!oldQuizVersion)
				throw new ReferenceError(
					'`oldQuizVersion` not found in `addQuestions`.'
				)

			// Create a new QuizVersion based on the old QuizVersion
			const newQuizVersion = new QuizVersion({
				questions: await removeOldQuestionsOnOverride(
					oldQuizVersion.questions,
					stripAllQuestions(questionDataList)
				),
				versionNumber: oldQuizVersion.versionNumber + 1,
				quizSubmissions: [],
			})
			newQuizVersion.questions = collapseQuestions(newQuizVersion.questions)

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

const validateAllQuestions = (questions) => {
	for (const question of questions) {
		if (!validateQuestion(question)) {
			return false
		}
	}
	return true
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
		return Object.assign({}, stripQuestionData(q), {
			questionNumber: currentQuestionNum,
		})
	})
	console.log(questions)
	return questions
}

/**
 *
 * @param {[]} dataList
 * @returns
 */
const stripAllQuestions = (dataList) => {
	const stripped = []
	dataList.forEach((data) => stripped.push(stripQuestionData(data)))
	return stripped
}

/**
 *
 * @param {[]} data
 * @returns
 */
const stripQuestionData = (data) => {
	return {
		questionType: data.questionType,
		questionNumber: data.questionNumber,
		question: data.question,
		responses: data.responses,
		answers: data.answers,
	}
}

/**
 * Removes question duplicates (favoring newQuestions)
 * @param {[]} oldQuestions
 * @param {[]} newQuestions
 */
const removeOldQuestionsOnOverride = async (oldQuestions, newQuestions) => {
	const answers = []
	for (const oldAnswer of oldQuestions) {
		let isIn = false
		for (const newAnswer of newQuestions) {
			if (oldAnswer.questionNumber == newAnswer.questionNumber) {
				isIn = true
			}
		}
		if (!isIn) {
			answers.push(oldAnswer)
		}
	}
	answers.push(...newQuestions)
	return answers
}
