const Quiz = require('../../database/models/quiz.model')
const QuizSubmission = require('../../database/models/quizSubmission.model')
const User = require('../../database/models/user.model')
const { CastError } = require('mongoose').Error
const {
	makeFakeQuizSubmission,
	makeFakeUser,
} = require('../../../__test__/fixtures/index')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeGetAllSubmissionGrades = require('./getAllSubmissionGrades')

describe('getAllSubmissionGrades Test Suite', () => {
	const getAllSubmissionGrades = makeGetAllSubmissionGrades({
		Quiz,
		QuizSubmission,
	})

	const quizId = makeFakeQuizSubmission().quizId
	const quizId2 = '621bae4cac71602b0104817d'
	const userId = makeFakeQuizSubmission().userId

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await User.deleteMany({})
		await QuizSubmission.deleteMany({})

		await User.insertMany([makeFakeUser({ _id: userId })])
		await QuizSubmission.insertMany([
			makeFakeQuizSubmission({
				isGraded: true,
				submitted: true,
				grade: 1,
				dateFinished: Date.now(),
			}),
			makeFakeQuizSubmission({
				isGraded: true,
				submitted: true,
				grade: 0.75,
				dateFinished: Date.now(),
			}),
			makeFakeQuizSubmission({
				isGraded: true,
				submitted: true,
				grade: 0.5,
				dateFinished: Date.now(),
			}),
			makeFakeQuizSubmission({
				quizId: quizId2,
				isGraded: true,
				submitted: true,
				grade: 0.5,
				dateFinished: Date.now(),
			}),
		])
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully gets all graded submissions within a quizId (1)', async () => {
		const { submissions } = await getAllSubmissionGrades(quizId)
		expect(submissions.length).toBe(3)
	})

	it('successfully gets all graded submissions within a quizId (2)', async () => {
		const { submissions } = await getAllSubmissionGrades(quizId2)
		expect(submissions.length).toBe(1)
	})

	it('successfully returns an empty list when there are no submissions', async () => {
		await QuizSubmission.deleteMany({})
		const { submissions } = await getAllSubmissionGrades(quizId)
		expect(submissions.length).toBe(0)
	})

	it('rejects an error when quizId is not provided', async () => {
		await expect(getAllSubmissionGrades()).rejects.toThrow(ReferenceError)
	})

	it('rejects an error when quizId is not an ObjectId parsable', async () => {
		await expect(getAllSubmissionGrades('111')).rejects.toThrow(CastError)
	})
})
