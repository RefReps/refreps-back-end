const Quiz = require('../../database/models/quiz.model')
const QuizVersion = require('../../database/models/quizVersion.model')
const { makeFakeQuiz } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuiz = require('./addQuiz')
const makeCopyQuiz = require('./copyQuiz')

describe('copyQuiz Test Suite', () => {
	const addQuiz = makeAddQuiz({ Quiz, QuizVersion })
	const copyQuiz = makeCopyQuiz({ Quiz, QuizVersion })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Quiz.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully copies a quiz', async () => {
		const { quiz: quizOriginal } = await addQuiz({ name: 'New Quiz' })
		const { quiz: quizCopy } = await copyQuiz(quizOriginal._id)
		expect({ _id: quizCopy._id }).not.toEqual({
			_id: quizOriginal._id,
		})
		expect(quizCopy._id).not.toEqual(quizOriginal._id)

		expect(quizCopy.name).toBe(quizOriginal.name)
	})

	it('fails when the active version cannot be found', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			const { quiz: quizOriginal } = await addQuiz({ name: 'New Quiz' })
			await QuizVersion.deleteMany({})
			await copyQuiz(quizOriginal._id)
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe('QuizVersion not found.')
	})

	it('fails when the target quiz cannot be found to copy', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			await copyQuiz('621acd9d3bb45e8fcec4c9ea')
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe('Quiz not found to copy.')
	})
})
