const Quiz = require('../../database/models/quiz.model')
const QuizVersion = require('../../database/models/quizVersion.model')
const {
	makeFakeQuestion,
	makeFakeQuizVersion,
	makeFakeQuiz,
} = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeBatchUpdateQuestions = require('./batchUpdateQuestions')

describe('deleteQuestion Test Suite', () => {
	const batchUpdateQuestions = makeBatchUpdateQuestions({ Quiz, QuizVersion })
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

	it('successfully adds a question', async () => {
		const { quiz, quizVersion } = await batchUpdateQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
		])

		expect(quiz.activeVersion).toBe(2)
		expect(quizVersion.questions.length).toBe(2)
	})

	it('successfully overrides old questions', async () => {
		await batchUpdateQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
		])
		const { quiz, quizVersion } = await batchUpdateQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 2 }),
			makeFakeQuestion({ questionNumber: 3 }),
		])

		expect(quiz.activeVersion).toBe(3)
		expect(quizVersion.questions.length).toBe(2)
	})

	it('successfully overwrites questions at the same time.', async () => {
		await batchUpdateQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1, question: 'q1' }),
		])
		const { quiz, quizVersion } = await batchUpdateQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 2, question: 'q2' }),
			makeFakeQuestion({ questionNumber: 3, question: 'q3' }),
		])

		expect(quiz.activeVersion).toBe(3)

		expect(quizVersion.questions.length).toBe(2)
		for (const [index, question] of quizVersion.questions.entries()) {
			expect(question.question).toBe(`q${index + 2}`)
		}
	})

	it('rejects an Error if addQuestionList is empty', async () => {
		await Quiz.deleteMany({})
		await expect(batchUpdateQuestions(quiz1._id)).rejects.toThrow(
			Error('At least 1 question must be added in `batchUpdateQuestions`.')
		)
	})

	it('rejects a TypeError if questions adding are not valid', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await Quiz.deleteMany({})
			await batchUpdateQuestions(quiz1._id, [
				makeFakeQuestion({ questionNumber: [1, 2] }),
			])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('TypeError')
		expect(errorMessage).toBe(
			'`questionDataList` in `addQuestionsList` has invalid questions.'
		)
	})

	it('rejects a ReferenceError when no quiz doc is found.', async () => {
		await Quiz.deleteMany({})
		await expect(
			batchUpdateQuestions(quiz1._id, [makeFakeQuestion()])
		).rejects.toThrow(ReferenceError('Quiz not found.'))
	})

	it('rejects a ReferenceError when no quiz version doc is found.', async () => {
		await QuizVersion.deleteMany({})
		await expect(
			batchUpdateQuestions(quiz1._id, [makeFakeQuestion()])
		).rejects.toThrow(
			ReferenceError('`oldQuizVersion` not found in `addQuestionsList`.')
		)
	})
})
