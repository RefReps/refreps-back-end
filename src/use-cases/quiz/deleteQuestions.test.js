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
const makeAddQuestion = require('./addQuestions')
const makeDeleteQuestion = require('./deleteQuestions.js')

describe('deleteQuestion Test Suite', () => {
	const addQuestion = makeAddQuestion({ Quiz, QuizVersion })
	const deleteQuestion = makeDeleteQuestion({ Quiz, QuizVersion })
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

	it('successfully deletes a question by questionNumber', async () => {
		await addQuestion(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
		])
		const { quiz, quizVersion } = await deleteQuestion(quiz1._id, [2])

		expect(quiz.activeVersion).toBe(3)

		expect(quizVersion.questions.length).toBe(1)
	})

	it('successfully deletes a question by questionNumber and condenses when needed', async () => {
		await addQuestion(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
			makeFakeQuestion({ questionNumber: 3 }),
		])
		const { quiz, quizVersion } = await deleteQuestion(quiz1._id, [2])

		expect(quiz.activeVersion).toBe(3)

		expect(quizVersion.questions.length).toBe(2)
		expect(quizVersion.questions[0].questionNumber).toBe(1)
		expect(quizVersion.questions[1].questionNumber).toBe(2)
	})

	it('successfully deletes multiple questions', async () => {
		await addQuestion(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
			makeFakeQuestion({ questionNumber: 3 }),
		])
		const { quiz, quizVersion } = await deleteQuestion(quiz1._id, [1, 3])

		expect(quiz.activeVersion).toBe(3)

		expect(quizVersion.questions.length).toBe(1)
		expect(quizVersion.questions[0].questionNumber).toBe(1)
	})

	it('fails to delete questions when the quiz doc is not found', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await Quiz.deleteMany({})
			await deleteQuestion(quiz1._id, [1, 3])
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe('Quiz not found.')
	})

	it('fails to delete questions when the old quiz version is not found', async () => {
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

	it('fails to delete questions when no questions are specified to be deleted', async () => {
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
