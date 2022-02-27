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
		expect(quizVersion.questions.length).toBe(3)
	})

	it('successfully deletes a question by questionNumber', async () => {
		await batchUpdateQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
			makeFakeQuestion({ questionNumber: 3 }),
		])
		const { quiz, quizVersion } = await batchUpdateQuestions(quiz1._id, [], [2])

		expect(quiz.activeVersion).toBe(3)

		expect(quizVersion.questions.length).toBe(2)
	})

	it('successfully adds and deletes questions at the same time.', async () => {
		await batchUpdateQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1, question: 'q1' }),
		])
		const { quiz, quizVersion } = await batchUpdateQuestions(
			quiz1._id,
			[
				makeFakeQuestion({ questionNumber: 2, question: 'q2' }),
				makeFakeQuestion({ questionNumber: 3, question: 'q3' }),
			],
			[1]
		)

		expect(quiz.activeVersion).toBe(3)

		expect(quizVersion.questions.length).toBe(2)
		for (const [index, question] of quizVersion.questions.entries()) {
			expect(question.question).toBe(`q${index + 2}`)
		}
	})

	it('rejects an Error if addQuestionList and deleteQuestionsList are both empty', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await Quiz.deleteMany({})
			await batchUpdateQuestions(quiz1._id)
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('Error')
		expect(errorMessage).toBe(
			'A question must at least be added or deleted in `batchUpdateQuestions`.'
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
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await Quiz.deleteMany({})
			await batchUpdateQuestions(quiz1._id, [], [1])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe('Quiz not found.')
	})

	it('rejects a ReferenceError when no quiz version doc is found.', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await QuizVersion.deleteMany({})
			await batchUpdateQuestions(quiz1._id, [], [1])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe(
			'`oldQuizVersion` not found in `addQuestionsList`.'
		)
	})

	it.skip('fails to delete questions when the old quiz version is not found', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await QuizVersion.deleteMany({})
			await deleteQuestion(quiz1._id, [1, 3])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe(
			'`oldQuizVersion` not found in `deleteQuestions`.'
		)
	})

	it.skip('fails to delete questions when no questions are specified to be deleted', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await deleteQuestion(quiz1._id)
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('Error')
		expect(errorMessage).toBe(
			'`questionNumbers` must be greater than 0 in `deleteQuestions`.'
		)
	})
})
