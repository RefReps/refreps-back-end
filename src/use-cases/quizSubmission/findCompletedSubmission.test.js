const QuizSubmission = require('../../database/models/quizSubmission.model')
const QuizVersion = require('../../database/models/quizVersion.model')
const { makeFakeQuizSubmission } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const { CastError } = require('mongoose').Error
const makeCreateSubmission = require('./createSubmission')
const makeAddAnswers = require('./addAnswers')
const makeFinishSubmission = require('./finishSubmission')
const makeFindCompletedSubmission = require('./findCompletedSubmission')

describe('createSubmission Test Suite', () => {
	const createSubmission = makeCreateSubmission({ QuizSubmission })
	const addAnswers = makeAddAnswers({ QuizSubmission })
	const finishSubmission = makeFinishSubmission({ QuizSubmission })
	const findCompletedSubmission = makeFindCompletedSubmission({
		QuizSubmission,
	})

	const { userId, quizId, quizVersionId } = makeFakeQuizSubmission()
	const quizVersionIdWithNoQuestions = '6215a32df2dddb9edd5b29ff'
	const answers = [
		{
			questionNumber: 1,
			answers: ['A'],
		},
		{
			questionNumber: 2,
			answers: ['C'],
		},
		{
			questionNumber: 3,
			answers: ['A', 'D'],
		},
		{
			questionNumber: 4,
			answers: ['Sandman'],
		},
		{
			questionNumber: 5,
			answers: ['true'],
		},
	]
	const answersIncorrect = [
		{
			questionNumber: 1,
			answers: ['B'],
		},
		{
			questionNumber: 2,
			answers: ['D'],
		},
		{
			questionNumber: 3,
			answers: ['A', 'C'],
		},
		{
			questionNumber: 4,
			answers: ['SaNdMaN'],
		},
		{
			questionNumber: 5,
			answers: ['false'],
		},
	]

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await QuizSubmission.deleteMany({})
		await QuizVersion.deleteMany({})
		await QuizVersion.insertMany([
			{
				_id: quizVersionId,
				versionNumber: 1,
				quizSubmissions: [],
				questions: [
					{
						questionNumber: 1,
						question: 'The answer is A.',
						responses: {
							A: 'Answer 1',
							B: 'Answer 2',
							C: 'Answer 3',
							D: 'Answer 4',
						},
						answers: ['A'],
						questionType: '1_CHOICE',
					},
					{
						questionNumber: 2,
						question: 'You may pick A or C.',
						responses: {
							A: 'Answer 1',
							B: 'Answer 2',
							C: 'Answer 3',
							D: 'Answer 4',
						},
						answers: ['A', 'C'],
						questionType: '1_CHOICE',
					},
					{
						questionNumber: 3,
						question: 'You must choose A and D.',
						responses: {
							A: 'Answer 1',
							B: 'Answer 2',
							C: 'Answer 3',
							D: 'Answer 4',
						},
						answers: ['A', 'D'],
						questionType: 'MULTI_CHOICE',
					},
					{
						questionNumber: 4,
						question: 'You must enter `Sandman`, `SANDMAN`, or `sandman`.',
						responses: {},
						answers: ['Sandman', 'SANDMAN', 'sandman'],
						questionType: 'FREE_RESPONSE',
					},
					{
						questionNumber: 5,
						question: 'The answer is `true`.',
						responses: {
							true: '',
							false: '',
						},
						answers: ['true'],
						questionType: 'TRUE_FALSE',
					},
				],
			},
			{
				_id: quizVersionIdWithNoQuestions,
				versionNumber: 1,
				quizSubmissions: [],
				questions: [],
			},
		])
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('gets submission information, which includes ids, userAnswers, quizQuestions (+answers), versionNumber', async () => {
		let submission = await createSubmission(userId, quizId, quizVersionId)
		await addAnswers(submission._id, answers)
		await finishSubmission(submission._id)
		submission = await findCompletedSubmission(submission._id)

		expect(typeof submission.userAnswers).toBe('object')
		expect(typeof submission.quizQuestions).toBe('object')
	})

	it('rejects a ReferenceError when the submission is not yet submitted', async () => {
		let submission = await createSubmission(userId, quizId, quizVersionId)
		await expect(findCompletedSubmission(submission._id)).rejects.toThrow(
			ReferenceError
		)
	})

	it('rejects a ReferenceError when quizVersionId is not populated', async () => {
		let errorName = 'nothing'
		let errorMessage = 'nothing'
		try {
			let submission = await createSubmission(userId, quizId, quizVersionId)
			await addAnswers(submission._id, answers)
			await finishSubmission(submission._id)
			await QuizVersion.deleteMany({})
			await findCompletedSubmission(submission._id)
		} catch (error) {
			errorName = error.name
			errorMessage = error.message
		}
		expect(errorName).toBe('ReferenceError')
		expect(errorMessage).toBe('Quiz Version doc not found.')
	})

	it('rejects a ReferenceError when no submissionId is provided', async () => {
		await expect(findCompletedSubmission()).rejects.toThrow(ReferenceError)
	})

	it('rejects a ReferenceError when no submission doc is found', async () => {
		await QuizSubmission.deleteMany({})
		await expect(findCompletedSubmission()).rejects.toThrow(ReferenceError)
	})

	it('rejects a CastError (Mongoose.Error) when no submissionId is not ObjectId parsable', async () => {
		await expect(
			findCompletedSubmission('621bb65bec82708f31f403f4')
		).rejects.toThrow(ReferenceError)
	})

	// it('grades correctly when there are all incorrect answers', async () => {
	// 	let submission = await createSubmission(userId, quizId, quizVersionId)
	// 	submission = await addAnswers(submission._id, answersIncorrect)
	// 	submission = await finishSubmission(submission._id)

	// 	expect(submission.submitted).toBe(true)
	// 	expect(submission.isGraded).toBe(true)
	// 	expect(submission.dateFinished).not.toBe(undefined)
	// 	expect(submission.grade).toBe(0)
	// 	expect(submission.answerOverrides.length).toBe(5)
	// })

	// it('grades correctly when some answers are not answered', async () => {
	// 	let submission = await createSubmission(userId, quizId, quizVersionId)
	// 	submission = await addAnswers(submission._id, [answers[0]])
	// 	submission = await finishSubmission(submission._id)

	// 	expect(submission.submitted).toBe(true)
	// 	expect(submission.isGraded).toBe(true)
	// 	expect(submission.dateFinished).not.toBe(undefined)
	// 	expect(submission.grade).toBe(0.2)
	// 	expect(submission.answerOverrides.length).toBe(5)
	// })

	// it('grades correctly when the maximum points for the quiz is 0', async () => {
	// 	let submission = await createSubmission(
	// 		userId,
	// 		quizId,
	// 		quizVersionIdWithNoQuestions
	// 	)
	// 	submission = await finishSubmission(submission._id)

	// 	expect(submission.submitted).toBe(true)
	// 	expect(submission.isGraded).toBe(true)
	// 	expect(submission.dateFinished).not.toBe(undefined)
	// 	expect(submission.grade).toBe(1)
	// 	expect(submission.answerOverrides.length).toBe(0)
	// })

	// it('grades correctly when too little questions are answered for a MULTI_CHOICE', async () => {
	// 	let submission = await createSubmission(userId, quizId, quizVersionId)
	// 	submission = await addAnswers(submission._id, [
	// 		{ questionNumber: 3, answers: ['A'] },
	// 	])
	// 	submission = await finishSubmission(submission._id)

	// 	expect(submission.submitted).toBe(true)
	// 	expect(submission.isGraded).toBe(true)
	// 	expect(submission.dateFinished).not.toBe(undefined)
	// 	expect(submission.grade).toBe(0)
	// 	expect(submission.answerOverrides.length).toBe(5)
	// })

	// it('throws an error when a Quiz Submission cannot be compared to a Quiz Version', async () => {
	// 	let quizVersionIdNotIn = '62159f42c559880ac0ad854d'
	// 	let errorName = 'Nothing'
	// 	let errorMessage = 'Nothing'
	// 	try {
	// 		let submission = await createSubmission(
	// 			userId,
	// 			quizId,
	// 			quizVersionIdNotIn
	// 		)
	// 		await finishSubmission(submission._id)
	// 	} catch (error) {
	// 		errorName = error.name
	// 		errorMessage = error.message
	// 	}
	// 	expect(errorName).toBe('ReferenceError')
	// 	expect(errorMessage).toBe('Quiz Version not found to compare answers with.')
	// })

	// it('throws an error if a submission cannot be found', async () => {
	// 	let submissionIdNotIn = '62159f42c559880ac0ad854d'
	// 	let errorMessage = 'Nothing'
	// 	try {
	// 		await finishSubmission(submissionIdNotIn)
	// 	} catch (error) {
	// 		errorName = error.name
	// 		errorMessage = error.message
	// 	}
	// 	expect(errorName).toBe('ReferenceError')
	// 	expect(errorMessage).toBe('Quiz submission not found to finish.')
	// })

	// it('throws an error if no submission id is provided', async () => {
	// 	let errorMessage = 'Nothing'
	// 	try {
	// 		await finishSubmission()
	// 	} catch (error) {
	// 		errorName = error.name
	// 		errorMessage = error.message
	// 	}
	// 	expect(errorName).toBe('ReferenceError')
	// 	expect(errorMessage).toBe(
	// 		'`submissionId` must be provided in createSubmission.'
	// 	)
	// })
})
