const Quiz = require('../../database/models/quiz.model')
const QuizVersion = require('../../database/models/quizVersion.model')
const {
	makeFakeQuiz,
	makeFakeQuizVersion,
} = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuiz = require('./addQuiz')
const makeFindQuizById = require('./findQuizById')

describe('findQuizById Test Suite', () => {
	const addQuiz = makeAddQuiz({ Quiz, QuizVersion })
	const findQuizById = makeFindQuizById({ Quiz, QuizVersion })
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

	it('successfully finds a quiz by id', async () => {
		const { quiz, quizVersion } = await findQuizById(quiz1._id)
		expect(quiz.name).toBe(quiz1.name)
	})

	it('finds the right quiz given multiple entries', async () => {
		const { quiz: quiz2 } = await addQuiz(makeFakeQuiz({ name: 'quiz2' }))
		const { quiz: quiz3 } = await addQuiz(makeFakeQuiz({ name: 'quiz3' }))

		const { quiz, quizVersion } = await findQuizById(quiz2._id)
		expect(quiz.name).toEqual(quiz2.name)
	})

	it('successfully finds only if the quiz is in the db', async () => {
		await expect(findQuizById('6197ae39ef8716d0dd181e08')).rejects.toThrow(
			ReferenceError
		)
	})

	it('successfully finds only if the quiz is in the db', async () => {
		await QuizVersion.deleteMany({})
		await expect(findQuizById(quiz1._id)).rejects.toThrow(ReferenceError)
	})
})
