const Quiz = require('../../database/models/quiz.model')
const QuizJsonMock = require('../../../__test__/fixtures/QuizJson')
const { makeFakeQuiz } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuiz = require('./addQuiz')
const makeFindQuizById = require('./findQuizById')

describe('findQuizById Test Suite', () => {
	const addQuiz = makeAddQuiz({ Quiz, QuizJson: QuizJsonMock })
	const findQuizById = makeFindQuizById({ Quiz, QuizJson: QuizJsonMock })

	let mockQuizData

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Quiz.deleteMany({})
		mockQuizData = await QuizJsonMock.loadLocalQuiz()
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds a quiz by id', async () => {
		const quiz1 = await addQuiz(makeFakeQuiz({ name: 'quiz1' }))

		const found = await findQuizById(quiz1._id)
		expect(found).toMatchObject(mockQuizData)
	})

	it('finds the right quiz given multiple entries', async () => {
		const quiz1 = await addQuiz(makeFakeQuiz({ name: 'quiz1' }))
		const quiz2 = await addQuiz(makeFakeQuiz({ name: 'quiz2' }))
		const quiz3 = await addQuiz(makeFakeQuiz({ name: 'quiz3' }))

		const found = await findQuizById(quiz2._id)
		expect(found.name).toEqual(mockQuizData.name)
	})

	it('successfully finds only if the quiz is in the db', async () => {
		await expect(findQuizById('6197ae39ef8716d0dd181e08')).rejects.toThrow(
			ReferenceError
		)
	})

	it('CastError when the id is not an ObjectId', async () => {
		let errorMessage = 'nothing'
		try {
			await findQuizById('123')
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Cast to ObjectId failed for value "123" (type string) at path "_id" for model "Quiz"'
		)
	})
})
