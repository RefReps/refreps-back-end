const { validateQuestion } = require('../../utils/quiz/questionValidator')
const QuestionType = require('../../utils/enums/QuestionType.js')
const QuestionTypes = [
	QuestionType.CHOICE_1,
	QuestionType.FREE_RESPONSE,
	QuestionType.MULTI_CHOICE,
	QuestionType.TRUE_FALSE,
]

module.exports = makeBatchUpdateQuestions = ({ Quiz, QuizVersion }) => {
	// Overwrites a quiz's questions with completely new ones
	// Resolve -> {quiz: doc, quizVersion: doc}
	// Reject -> error name
	return async function batchUpdateQuestions(quizId, addQuestionsList = []) {
		try {
			// Something must be added
			if (!(addQuestionsList.length > 0))
				throw new Error(
					'At least 1 question must be added in `batchUpdateQuestions`.'
				)

			// TODO: Validate incoming questions (if needed)
			if (!validateAllQuestions(addQuestionsList))
				throw new TypeError(
					'`questionDataList` in `addQuestionsList` has invalid questions.'
				)

			// TODO: Get the quiz
			const quiz = await Quiz.findById(quizId).populate('quizVersions').exec()
			if (!quiz) throw new ReferenceError('Quiz not found.')

			// TODO: Get the old quiz version and check if exists
			const oldQuizVersion = getActiveVersion(quiz)
			if (!oldQuizVersion)
				throw new ReferenceError(
					'`oldQuizVersion` not found in `addQuestionsList`.'
				)

			// TODO: Create a new quizVersion based on the old quizVersion
			const newQuizVersion = new QuizVersion({
				// questions: oldQuizVersion.questions,
				questions: [],
				versionNumber: oldQuizVersion.versionNumber + 1,
				quizSubmissions: [],
			})

			// TODO: Add questions (Overwirte if needed)
			newQuizVersion.questions = stripAllQuestions(addQuestionsList)

			// TODO: Collapse questions
			newQuizVersion.questions = collapseQuestions(newQuizVersion.questions)

			// TODO: Set the quiz.activeVersion to the new quizVersion
			quiz.depopulate('quizVersions')
			quiz.quizVersions.push(newQuizVersion._id)
			quiz.markModified('quizVersions')
			quiz.activeVersion = newQuizVersion.versionNumber
			quiz.markModified('activeVersion')

			// TODO: Save the new quizVersion to the quiz doc

			await newQuizVersion.save()
			await quiz.save()

			return Promise.resolve({
				quiz: quiz.toObject(),
				quizVersion: newQuizVersion.toObject({ flattenMaps: true }),
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
