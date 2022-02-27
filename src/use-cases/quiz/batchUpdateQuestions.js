const { validateQuestion } = require('../../utils/quiz/questionValidator')
const QuestionType = require('../../utils/enums/QuestionType.js')
const QuestionTypes = [
	QuestionType.CHOICE_1,
	QuestionType.FREE_RESPONSE,
	QuestionType.MULTI_CHOICE,
	QuestionType.TRUE_FALSE,
]

module.exports = makeBatchUpdateQuestions = ({ Quiz, QuizVersion }) => {
	// Remove questions in a quiz then add new questions
	// Resolve -> {quiz: doc, quizVersion: doc}
	// Reject -> error name
	return async function batchUpdateQuestions(
		quizId,
		addQuestionsList = [],
		deleteQuestionsList = []
	) {
		try {
			// Something must be either added or deleted
			if (!(addQuestionsList.length > 0 || deleteQuestionsList.length > 0))
				throw new Error(
					'A question must at least be added or deleted in `batchUpdateQuestions`.'
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
				questions: oldQuizVersion.questions,
				versionNumber: oldQuizVersion.versionNumber + 1,
				quizSubmissions: [],
			})

			// TODO: Delete questions
			if (deleteQuestionsList.length > 0) {
				newQuizVersion.questions = removedQuestions(
					oldQuizVersion,
					deleteQuestionsList
				)
			}

			// TODO: Add questions (Overwirte if needed)
			newQuizVersion.questions = await removeOldQuestionsOnOverride(
				newQuizVersion.questions,
				stripAllQuestions(addQuestionsList)
			)

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
