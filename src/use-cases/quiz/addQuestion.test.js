const QuizMock = require('../../../__test__/fixtures/Quiz')
const QuizJsonMock = require('../../../__test__/fixtures/QuizJson')
const { makeFakeQuestion } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuestion = require('./addQuestion')

describe('addQuestion Test Suite', () => {
	const addQuestion = makeAddQuestion({
		Quiz: QuizMock,
		QuizJson: QuizJsonMock,
	})

	beforeAll(async () => {
		await dbConnect()
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a question', async () => {
		const question = await addQuestion('quizId', 1, makeFakeQuestion())
		expect(question).toBe(true)
	})

	it('fails to add question when required properties are not passed', async () => {
		let errorName = 'nothing'
		try {
			await addQuestion()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fails to add a question that does not have valid properties', async () => {
		let errorName = 'nothing'
		try {
			await addQuestion('quizId', 1, { badQuestion: 'very Bad' })
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('TypeError')
	})
})
