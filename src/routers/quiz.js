const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')
const { User, Quiz, QuizSubmission } = useCases

// Middleware Imports
const { isAuthenticated } = require('../utils/middleware/auth')
const { buildErrorResponse } = require('../utils/responses/index')
const quizMiddleware = require('../middleware/quiz')

router.use(isAuthenticated)

router
	.route('/')
	// Create a new quiz
	.post(multer.none(), async (req, res) => {
		try {
			const { name } = req.body
			const { quiz } = await Quiz.addQuiz({ name })
			// const { quiz: quiz2 } = await Quiz.addQuiz({ name })
			res.status(200).send({ _id: quiz._id })
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:quizId')
	// Get a quiz
	// response -> {quiz: object, quizVersion: object}
	.get(async (req, res) => {
		try {
			const { quizId } = req.params
			const { quiz, quizVersion } = await useCases.Quiz.findQuizById(quizId)

			res.send({ quiz, quizVersion })
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:quizId/batch')
	// Update a quiz in batch
	// req.body = {name: '', questions: [{quizQuestion}, ...]}
	// response -> {quiz: object, quizVersion: object}
	.put(isAuthenticated, async (req, res) => {
		try {
			const { quizId } = req.params
			const { questions, deleteQuestions } = req.body

			const { quiz, quizVersion } = await useCases.Quiz.batchUpdateQuestions(
				quizId,
				questions,
				deleteQuestions
			)

			res.send({ quiz, quizVersion })
		} catch (error) {
			res.status(400).send(buildErrorResponse(error))
		}
	})

router
	.route('/:quizId/start')
	// Start a quiz
	// Response -> {quizQuestions: object, quizSubmission: object}
	.get(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId } = req.params
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			const user = await useCases.User.findUserByEmail(email)

			const { submissions } = await useCases.Quiz.getAllSubmissionGrades(quizId)
			const { course } = await useCases.Course.findCourseByQuizId()
			if (submissions.length >= course.settings.maximumQuizAttempts) {
				throw new Error('Maximum Quiz Attempts Exhausted')
			}

			// if (submissions.length >=)

			const { questions, quizSubmission } = await useCases.Quiz.startQuiz(
				quizId,
				user._id
			)

			res.status(200).json({ quizQuestions: questions, quizSubmission })
		} catch (error) {
			res.status(400).json(buildErrorResponse(error))
		}
	})

router
	.route('/:quizId/resume')
	// Resume a quiz (WARNING!!!!! THIS IS BASICALLY JUST START QUIZ)
	// This route uses the same code as /:quizId/start because of internal
	// functionality of how Quiz.startQuiz() works
	// Response -> {quizQuestions: object, quizSubmission: object}
	.get(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId } = req.params
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			const user = await useCases.User.findUserByEmail(email)

			const { questions, quizSubmission } = await useCases.Quiz.startQuiz(
				quizId,
				user._id
			)

			res.status(200).json({ quizQuestions: questions, quizSubmission })
		} catch (error) {
			res.status(400).json(buildErrorResponse(error))
		}
	})

router
	.route('/:quizId/submission/:submissionId')
	// Save incoming userAnswers to the quiz
	// req.body = {questions: [{questionNumber: Number, answers: [String,...]}]}
	.put(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId, submissionId } = req.params
			const { questions: userAnswers } = req.body
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			if (!userAnswers) {
				throw ReferenceError('req.body needs to be provided')
			}
			const user = await User.findUserByEmail(email)
			const submission = await QuizSubmission.addAnswer(
				submissionId,
				userAnswers
			)
			res.status(200).json(submission)
		} catch (error) {
			res.status(400).json(buildErrorResponse(error))
		}
	})

router
	.route('/:quizId/grade')
	// Get all grades for a user (Mainly for student seeing their own quiz)
	// Response -> {submissions: [{userId, submissionId, quizId, submissionsNumbger, grade, userAnswers, quizQuestions, quizVersionNumber, dateStarted, dateFinished},...]}
	.get(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId } = req.params
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			const user = await User.findUserByEmail(email)
			const { submissions } = await QuizSubmission.findAllCompletedInQuiz(
				quizId,
				user._id
			)

			res.status(200).json({ submissions })
		} catch (error) {
			res.status(400).json(buildErrorResponse(error))
		}
	})
router
	.route('/:quizId/grade/:submissionId')
	// Grade and finish a quiz that was in progress
	// Response -> {submission: object}
	.post(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId, submissionId } = req.params
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			const user = await User.findUserByEmail(email)
			const submission = await QuizSubmission.finishSubmission(submissionId)

			res.status(200).json({ submission })
		} catch (error) {
			res.status(400).json(buildErrorResponse(error))
		}
	})

router
	.route('/:quizId/view-grades')
	// Get all grades for the quiz
	// Response -> {submissions: [{submissionId, userId, email, grade, submissionNumber, dateStarted, dateFinished},...]}
	.get(isAuthenticated, async (req, res) => {
		try {
			const { quizId } = req.params
			let { submissions } = await Quiz.getAllSubmissionGrades(quizId)

			res.status(200).json({ submissions })
		} catch (error) {
			res.status(400).json(buildErrorResponse(error))
		}
	})

router
	.route('/:quizId/submission/:submissionId')
	.get(quizMiddleware.getStudentQuizAttempt)

module.exports = router
