const Quiz = require('../../database/models/quiz.model')
const QuizVersion = require('../../database/models/quizVersion.model')
const {
	makeFakeQuestion,
	makeFakeQuiz,
	makeFakeQuizVersion,
} = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuestion = require('./addQuestions')

describe('addQuestion Test Suite', () => {
	const addQuestion = makeAddQuestion({ Quiz, QuizVersion })
	let quiz1

	beforeEach(async () => {
		await dbConnect()
		// Remove all quiz and quizVersion docs
		await QuizVersion.deleteMany({})
		await Quiz.deleteMany({})

		// Add quizVersion doc
		const version = new QuizVersion(makeFakeQuizVersion())
		await version.save()
		// Add quiz doc (bind with quizVersion doc)
		quiz1 = new Quiz(makeFakeQuiz({ quizVersions: [version._id] }))
		await quiz1.save()
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a question to an empty quiz', async () => {
		const { quiz, quizVersion } = await addQuestion(quiz1._id, [
			makeFakeQuestion(),
		])

		expect(quiz.activeVersion).toBe(2)

		expect(quizVersion.questions.length).toBe(1)
	})

	it('successfully adds a question to a quiz with questions in it', async () => {
		await addQuestion(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
		])
		const { quiz, quizVersion } = await addQuestion(quiz1._id, [
			makeFakeQuestion({ questionNumber: 3 }),
		])

		expect(quiz.activeVersion).toBe(3)
		expect(quiz.quizVersions.length).toBe(3)

		expect(quizVersion.questions.length).toBe(3)
		expect(quizVersion.versionNumber).toBe(3)
	})

	it('successfully adds questions when they need to be overwritten', async () => {
		await addQuestion(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
		])
		const { quiz, quizVersion } = await addQuestion(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1, question: 'New question #1' }),
		])

		expect(quiz.activeVersion).toBe(3)
		expect(quiz.quizVersions.length).toBe(3)

		expect(quizVersion.questions.length).toBe(2)
		expect(quizVersion.versionNumber).toBe(3)
	})

	it('fails to add question batch when invalid questions are passed', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await addQuestion(quiz1._id, [makeFakeQuestion(), { questionNumber: 1 }])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('TypeError')
		expect(errorMessage).toBe(
			'`questionDataList` in `addQuestions` has invalid questions'
		)
	})

	it('fails to add question batch when no questions are passed', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await addQuestion(quiz1._id)
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('Error')
		expect(errorMessage).toBe(
			'`questionDataList` in `addQuestions` must not be empty.'
		)
	})

	it('fails to add question batch when there is no quizVersion doc found', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		await QuizVersion.deleteMany({})
		try {
			await addQuestion(quiz1._id, [makeFakeQuestion()])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe('`oldQuizVersion` not found in `addQuestions`.')
	})

	it('fails to add question batch when no quiz is found', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		await QuizVersion.deleteMany({})
		try {
			await addQuestion('621acd9d3bb45e8fcec4c9ea', [makeFakeQuestion()])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe('Quiz not found')
	})
})
