const Quiz = require('../../database/models/quiz.model')
const QuizJsonMock = require('../../../__test__/fixtures/QuizJson')
const { makeFakeQuiz } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuiz = require('./addQuiz')
const makeCopyQuiz = require('./copyQuiz')

describe('copyQuiz Test Suite', () => {
	const addQuiz = makeAddQuiz({ Quiz, QuizJson: QuizJsonMock })
	const copyQuiz = makeCopyQuiz({ Quiz, QuizJson: QuizJsonMock })

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
		const quiz = await addQuiz(makeFakeQuiz())
		const copy = await copyQuiz(quiz._id)
		expect({ _id: copy._id, filename: copy.filename }).not.toEqual({
			_id: quiz._id,
			filename: quiz.filename,
		})
		expect(copy.name).toEqual(quiz.name)
	})

	it('fails to copy if cannot find the quiz', async () => {
		let errorName = 'nothing'
		try {
			await copyQuiz('61f9c07a5b333683766bae70')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fails to copy if invalid id', async () => {
		let errorName = 'nothing'
		try {
			await copyQuiz('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})

	// it('fails to add a quiz that does not have valid properties', async () => {
	// 	let errorName = 'nothing'
	// 	try {
	// 		await addQuiz(makeFakeQuiz({ name: '' }))
	// 	} catch (error) {
	// 		errorName = error.name
	// 	}
	// 	expect(errorName).toBe('ValidationError')
	// })
})
