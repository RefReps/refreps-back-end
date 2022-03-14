const QuizSubmission = require('../../database/models/quizSubmission.model')
const { makeFakeQuizSubmission } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeCreateSubmission = require('./createSubmission')
const makeAddAnswers = require('./addAnswers')

describe('createSubmission Test Suite', () => {
	const createSubmission = makeCreateSubmission({ QuizSubmission })
	const addAnswers = makeAddAnswers({ QuizSubmission })

	const { userId, quizId, quizVersionId } = makeFakeQuizSubmission()
	const answers = [
		{
			questionNumber: 1,
			answers: ['A', 'B'],
		},
		{
			questionNumber: 2,
			answers: ['A'],
		},
		{
			questionNumber: 3,
			answers: ['true'],
		},
	]

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await QuizSubmission.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds questions to a submission that has none to start', async () => {
		const sub = await createSubmission(userId, quizId, quizVersionId)
		const { submission } = await addAnswers(sub._id, answers)
		expect(submission.userAnswers).not.toBeNull()
		expect(submission.userAnswers[0].questionNumber).toBe(1)
		expect(submission.userAnswers[1].questionNumber).toBe(2)
		expect(submission.userAnswers[2].questionNumber).toBe(3)
	})

	it('successfully adds questions to a submission in small increments', async () => {
		const sub = await createSubmission(userId, quizId, quizVersionId)
		await addAnswers(sub._id, [answers[0]])
		const { submission } = await addAnswers(sub._id, [answers[1], answers[2]])
		expect(submission.userAnswers).not.toBeNull()
		expect(submission.userAnswers[0].questionNumber).toBe(1)
		expect(submission.userAnswers[1].questionNumber).toBe(2)
		expect(submission.userAnswers[2].questionNumber).toBe(3)
	})

	it('successfully adds questions to a submission by overriding when needed', async () => {
		const sub = await createSubmission(userId, quizId, quizVersionId)
		const oldAnswer = {
			questionNumber: 1,
			answers: ['true'],
		}
		const newAnswer = {
			questionNumber: 1,
			answers: ['false'],
		}
		await addAnswers(sub._id, [oldAnswer])
		const { submission } = await addAnswers(sub._id, [answers[1], newAnswer])
		expect(submission.userAnswers).not.toBeNull()
		expect(submission.userAnswers.length).toBe(2)
	})

	it('fails to add questions when cannot find submission', async () => {
		let errorName = 'nothing'
		try {
			await addAnswers('6212c736e5877e3e5f1b3981', answers)
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('resolves submission when there are no questions to add', async () => {
		const sub = await createSubmission(userId, quizId, quizVersionId)
		await addAnswers(sub._id, [answers[0]])
		const { submission } = await addAnswers(sub._id)
		await expect(addAnswers(submission._id)).resolves.toMatchObject({})
	})

	it('fails to add questions there is no submissionId', async () => {
		let errorName = 'nothing'
		try {
			await addAnswers()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})
})
