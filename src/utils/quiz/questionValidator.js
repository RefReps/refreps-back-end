const QuestionType = require('../enums/QuestionType')

/**
 * Determines if a question object is valid.
 * @param {*} question
 * @returns boolean
 */
const validateQuestion = (question) => {
	switch (getType(question)) {
		case QuestionType.CHOICE_1:
			return validate1Choice(question)
		case QuestionType.MULTI_CHOICE:
			return validateMultiChoice(question)
		case QuestionType.FREE_RESPONSE:
			return validateFreeResponse(question)
		case QuestionType.TRUE_FALSE:
			return validateTrueFalse(question)
		default:
			return false
	}
}

const validate1Choice = (question) => {
	if (
		!hasQuestionNumber(question) ||
		!hasQuestionToAsk(question) ||
		!hasResponses(question) ||
		!hasAnswers(question) ||
		!hasPoints(question)
	) {
		return false
	}
	return true
}

const validateMultiChoice = (question) => {
	if (
		!hasQuestionNumber(question) ||
		!hasQuestionToAsk(question) ||
		!hasResponses(question) ||
		!hasAnswers(question) ||
		!hasPoints(question)
	) {
		return false
	}
	return true
}

const validateFreeResponse = (question) => {
	if (
		!hasQuestionNumber(question) ||
		!hasQuestionToAsk(question) ||
		!hasAnswers(question) ||
		!hasPoints(question)
	) {
		return false
	}
	return true
}

const validateTrueFalse = (question) => {
	if (
		!hasQuestionNumber(question) ||
		!hasQuestionToAsk(question) ||
		!hasAnswers(question, ['true', 'false']) ||
		!hasPoints(question)
	) {
		return false
	}
	return true
}

const getType = (question) => {
	return question.questionType ? question.questionType : QuestionType.INVALID
}

/**
 * Verifies that the question.questionNumber exists and is type number
 * @param {*} question
 * @returns boolean
 */
const hasQuestionNumber = (question) => {
	return typeof question.questionNumber == 'number' ? true : false
}

/**
 * Verifies that question.question exists and is type string
 * @param {*} question
 * @returns boolean
 */
const hasQuestionToAsk = (question) => {
	return typeof question.question == 'string' ? true : false
}

const hasResponses = (question) => {
	if (!(typeof question.responses == 'object')) return false
	if (Array.isArray(question.responses)) return false
	if (containsNonStringValues(question)) return false
	return true
}

/**
 * Verifies question.answers is an array and has only type strings within.
 * If stict is provided, all answers within question.answers must be a subset
 * of the strict array. E.g. question.answers = ['true'] is valid
 * for strict = ['true', 'false']
 * @param {*} question
 * @param {[]} strict [string]
 * @returns boolean
 */
const hasAnswers = (question, strict = []) => {
	if (!Array.isArray(question.answers)) return false
	for (answer of question.answers) {
		if (!(typeof answer == 'string')) return false
	}
	if (strict.length > 0) {
		for (answer of question.answers) {
			if (!strict.includes(answer)) return false
		}
	}
	return true
}

/**
 * Verifies question.points exists.
 * Verifies question.points is a number.
 * Verifies question.points is >= 0.
 * @param {*} question
 * @returns
 */
const hasPoints = (question) => {
	if (!(typeof question.points == 'number')) return false
	if (!(question.points >= 0)) return false
	return true
}

/**
 * Checks if there are any values in the object that are not a string.
 * If there is at least 1 value in the map that is not a string, it will return false.
 * If all values are typeof string, it will return true.
 * @param {*} question
 * @returns boolean
 */
function containsNonStringValues(question) {
	return (
		Object.values(question.responses).filter(
			(value) => typeof value != 'string'
		).length > 0
	)
}

module.exports = {
	validateQuestion,
}
