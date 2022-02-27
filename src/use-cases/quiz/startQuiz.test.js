const Quiz = require('../../database/models/quiz.model')
const QuizVersion = require('../../database/models/quizVersion.model')
const QuizSubmission = require('../../database/models/quizSubmission.model')
const User = require('../../database/models/user.model')
const {
	makeFakeQuizSubmission,
	makeFakeQuiz,
	makeFakeQuizVersion,
	makeFakeQuestion,
	makeFakeUser,
} = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddQuiz = require('./addQuiz')
const makeAddQuestions = require('./addQuestions')
const makeStartQuiz = require('./startQuiz')

const makeFinishSubmission = require('../quizSubmission/finishSubmission')

describe('createSubmission Test Suite', () => {
	const addQuiz = makeAddQuiz({ Quiz, QuizVersion })
	const addQuestions = makeAddQuestions({ Quiz, QuizVersion })
	const startQuiz = makeStartQuiz({ Quiz, QuizVersion, QuizSubmission })

	const finishSubmission = makeFinishSubmission({ QuizSubmission })

	const { userId, quizId, quizVersionId } = makeFakeQuizSubmission()
	const quizVersionIdWithNoQuestions = '6215a32df2dddb9edd5b29ff'

	let quiz1, user1

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Quiz.deleteMany({})
		await QuizVersion.deleteMany({})
		await QuizSubmission.deleteMany({})
		await User.deleteMany({})

		// Add a quiz
		const { quiz } = await addQuiz({})
		quiz1 = quiz
		await addQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 1 }),
			makeFakeQuestion({ questionNumber: 2 }),
		])

		// Add a user
		user1 = new User(makeFakeUser({}))
		await user1.save()
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully starts a quiz and returns the questions and quizSubmission', async () => {
		const { questions, quizSubmission } = await startQuiz(quiz1._id, user1._id)
		expect(questions.length).toBe(2)
		expect(quizSubmission.submissionNumber).toBe(1)
	})

	it('rejects a ReferenceError when a quiz is not found in the db.', async () => {
		await Quiz.deleteMany({})
		await expect(startQuiz(quiz1._id, user1._id)).rejects.toThrow(
			ReferenceError
		)
	})

	it('rejects a ReferenceError when active quiz version is not found on quiz doc.', async () => {
		await QuizVersion.deleteMany({})
		await expect(startQuiz(quiz1._id, user1._id)).rejects.toThrow(
			ReferenceError
		)
	})

	it('resolves {questions, quizSubmission} when there is already a submission in progress', async () => {
		await startQuiz(quiz1._id, user1._id) // Initial quiz started
		const { quiz } = await addQuestions(quiz1._id, [
			makeFakeQuestion({ questionNumber: 3 }),
		])
		expect(quiz.activeVersion).toBe(3)

		// Quiz for the same id on the same user is attempted. Should return the same quiz version questions/submission
		const { questions, quizSubmission } = await startQuiz(quiz1._id, user1._id)
		expect(questions.length).toBe(2)
		expect(quizSubmission.submissionNumber).toBe(1)
	})

	it('resovles with the incremented submissionNumber when there is already a completed submission', async () => {
		// First attempt
		const { questions: q1, quizSubmission: qs1 } = await startQuiz(
			quiz1._id,
			user1._id
		)
		await finishSubmission(qs1._id) // Finish first attempt

		// Second Attempt start
		const { questions: q2, quizSubmission: qs2 } = await startQuiz(
			quiz1._id,
			user1._id
		)
		expect(qs2.submissionNumber).toBe(2)
	})
})
