const fs = require('fs')
const fsPromise = fs.promises
require('dotenv').config({ path: '.env' })
const localPath = process.env.LOCAL_UPLOAD_PATH

const Validator = require('jsonschema').Validator
const {
	freeResponseSchema,
	multiChoiceSchema,
	oneChoiceSchema,
	trueFalseSchema,
	quizRootSchema,
} = require('./quizSchemas')
const questionSchemas = {
	FREE_RESPONSE: freeResponseSchema,
	MULTI_CHOICE: multiChoiceSchema,
	'1_CHOICE': oneChoiceSchema,
	TRUE_FALSE: trueFalseSchema,
}

const touch = async (filepath) => {
	try {
		await fsPromise.writeFile(filepath, JSON.stringify({}))
		return true
	} catch (err) {
		return false
	}
}

const loadLocalQuiz = async (filepath) => {
	try {
		let fileData = await fsPromise.readFile(filepath)
		return JSON.parse(fileData)
	} catch (err) {
		throw ReferenceError('No quiz found.')
	}
}

const saveLocalQuiz = async (filepath, data) => {
	try {
		let dataJson = JSON.stringify(data)
		await fsPromise.writeFile(filepath, dataJson)
		return true
	} catch (err) {
		throw err
	}
}

// condense the ordering of the questions
// e.g. {name: 'quiz 1', questions: {1: {}, 3: {}}
//   => {name: 'quiz 1', questions: {1: {}, 2: {}}
const condenseOrdering = (quizRootData) => {
	let { name, questions } = quizRootData
	if (!(name && questions)) {
		throw ReferenceError('Could not find valid root in quizRootData.')
	}

	const condensedQuiz = { name, questions: {} }
	let questionNumber = 1
	for (const [key, questionData] of Object.entries(questions)) {
		condensedQuiz.questions[questionNumber] = questionData
		questionNumber += 1
	}
	return condensedQuiz
}

let v = new Validator()
const validateQuizQuestionData = (questionObjectData) => {
	const questionType = questionObjectData.type
	if (!questionType) {
		return false
	}
	console.log(
		v.validate(questionObjectData, questionSchemas[questionType]).valid
	)
	return v.validate(questionObjectData, questionSchemas[questionType]).valid
}

const validateQuizRootData = (quizData) => {
	if (!v.validate(quizData, quizRootSchema).valid) {
		return false
	}
	for (const [questionNumber, questionData] of Object.entries(
		quizData.questions
	)) {
		if (!validateQuizQuestionData(questionData)) {
			return false
		}
	}
	return true
}

module.exports = {
	touch,
	loadLocalQuiz,
	saveLocalQuiz,
	condenseOrdering,
	validateQuizQuestionData,
	validateQuizRootData,
	localPath,
}
