const QuizSubmission = require('../../database/models/quizSubmission.model')
const { makeFakeQuizSubmission } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeCreateSubmission = require('./createSubmission')

describe('createSubmission Test Suite', () => {
	const createSubmission = makeCreateSubmission({ QuizSubmission })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await QuizSubmission.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a quiz submission', async () => {
        const { userId, quizId, quizVersionId } = makeFakeQuizSubmission()
		const submission = await createSubmission(userId, quizId, quizVersionId)
		expect(submission.submissionNumber).toBe(1)
		expect(submission).not.toBeNull()
	})

    it('successfully auto incrememnts a new submission on creation for a submission with the same quizId', async () => {
        const { userId, quizId, quizVersionId } = makeFakeQuizSubmission()
		const submission1 = await createSubmission(userId, quizId, quizVersionId)
		const submission2 = await createSubmission(userId, quizId, quizVersionId)
		expect(submission2.submissionNumber).toBe(2)
		expect(submission2).not.toBeNull()
	})

    it('successfully auto incrememnts when 2 different users take the same quiz', async () => {
        const { quizId, quizVersionId } = makeFakeQuizSubmission()
        const userId1 = '6212c736e5877e3e5f1b3981'
        const userId2 = '6212c736e5877e3e5f1b3983'
		const submission1 = await createSubmission(userId1, quizId, quizVersionId)
		const submission2 = await createSubmission(userId2, quizId, quizVersionId)
		expect(submission1.submissionNumber).toBe(1)
		expect(submission2.submissionNumber).toBe(1)
	})

    it('successfully auto incrememnts when the same user takes 2 different quizzes', async () => {
        const { userId, quizVersionId } = makeFakeQuizSubmission()
        const quizId1 = '6212c736e5877e3e5f1b3981'
        const quizId2 = '6212c736e5877e3e5f1b3983'
		const submission1 = await createSubmission(userId, quizId1, quizVersionId)
		const submission2 = await createSubmission(userId, quizId2, quizVersionId)
		expect(submission1.submissionNumber).toBe(1)
		expect(submission2.submissionNumber).toBe(1)
	})

	it('fails to add a quiz submission userId is not provided', async () => {
		let errorName = 'nothing'
		try {
			await createSubmission()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

    it('fails to add a quiz submission quizId is not provided', async () => {
		let errorName = 'nothing'
		try {
			await createSubmission('6212c736e5877e3e5f1b3981')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

    it('fails to add a quiz submission quizVersionId is not provided', async () => {
		let errorName = 'nothing'
		try {
			await createSubmission('6212c736e5877e3e5f1b3981', '6212c736e5877e3e5f1b3983')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fails to add a quiz submission that does not have valid properties', async () => {
		let errorName = 'nothing'
		try {
			await createSubmission('123', '123', '123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})
})
