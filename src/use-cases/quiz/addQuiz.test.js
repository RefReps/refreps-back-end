const Quiz = require('../../database/models/quiz.model')
const QuizVersion = require('../../database/models/quizVersion.model')
const { makeFakeQuiz } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuiz = require('./addQuiz')

describe('addQuiz Test Suite', () => {
	const addQuiz = makeAddQuiz({ Quiz, QuizVersion })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Quiz.deleteMany({})
		await QuizVersion.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a quiz', async () => {
		const { quiz } = await addQuiz(makeFakeQuiz())
		expect(quiz.name).toBe(makeFakeQuiz().name)
		expect(quiz.activeVersion).toBe(1)
	})

	it('successfully adds a quiz when no params are passed', async () => {
		const { quiz } = await addQuiz()
		expect(quiz.name).toBe('New Quiz')
		expect(quiz.activeVersion).toBe(1)
	})

	it('fails to add quiz when cannot validate properties', async () => {
		let errorName = 'nothing'
		try {
			await addQuiz({ name: ['hello'] })
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})
})
