const Quiz = require('../../database/models/quiz.model')
const QuizJsonMock = require('../../../__test__/fixtures/QuizJson')
const { makeFakeQuiz } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuiz = require('./addQuiz')

describe('addQuiz Test Suite', () => {
	const addQuiz = makeAddQuiz({ Quiz, QuizJson: QuizJsonMock })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Quiz.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a quiz', async () => {
		const quiz = await addQuiz(makeFakeQuiz(), true)
		expect(quiz.name).toBe(makeFakeQuiz().name)
	})

	it('fails to add quiz when required properties are not passed', async () => {
		let errorName = 'nothing'
		try {
			await addQuiz()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})

	it('fails to add a quiz that does not have valid properties', async () => {
		let errorName = 'nothing'
		try {
			await addQuiz(makeFakeQuiz({ name: '' }), true)
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})
})
