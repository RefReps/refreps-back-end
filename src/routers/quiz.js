const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')
const { User, Quiz } = require('../use-cases/index')
const quizJson = require('../utils/quiz/quizJson')

// Middleware Imports
const { isAuthenticated } = require('../utils/middleware/auth')

router
	.route('/')
	// .get(async (req, res) => {
	// 	try {
	// 		const result = await useCases.course.findAllCourses()
	// 		res.send(result.courses)
	// 	} catch (error) {
	// 		res.status(400).send(error)
	// 	}
	// })
	.post(multer.none(), async (req, res) => {
		try {
			const { name } = req.body
			const quiz = await useCases.Quiz.addQuiz({ name })
			res.status(200).send({ _id: quiz._id })
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:quizId')
	.get(async (req, res) => {
		try {
			const { quizId } = req.params
			const quiz = await useCases.Quiz.findQuizById(quizId)
			const json = await quizJson.loadLocalQuiz(
				`${process.env.LOCAL_UPLOAD_PATH}${quiz.filename}`
			)
			res.send(json)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	.delete(async (req, res) => {
		try {
			const { quizId } = req.params
			// const { courseId } = req.params
			// const result = await useCases.course.deleteCourse(courseId)
			// res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// Add new question
	// req.body must be JSON
	.post(async (req, res) => {
		try {
			const { quizId } = req.params
			const { type, questionNumber, question, responses, answers, answer } =
				req.body

			const quiz = await useCases.Quiz.findQuizById(quizId)
			const result = await useCases.Quiz.addQuestion(
				quiz._id,
				questionNumber || 200,
				{
					type,
					question,
					responses,
					answers,
					answer,
				}
			)

			res.send({ success: true })
		} catch (error) {
			res
				.status(400)
				.send({ success: false, error: error.name, reason: error.message })
		}
	})

router.route('/:quizId/number/:questionNumber').delete(async (req, res) => {
	try {
		const { quizId, questionNumber } = req.params
		await useCases.Quiz.deleteQuestion(quizId, questionNumber)
		return res.status(201).send({ success: true })
	} catch (err) {
		return res
			.status(400)
			.send({ success: false, error: err.name, reason: err.message })
	}
})

router
	.route('/:quizId/start')
	// Start a quiz
	.get(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId } = req.params
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			const user = await User.findUserByEmail(email)
			const quizData = await Quiz.startQuiz(quizId, user._id)
			res.status(200).json(quizData)
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

router
	.route('/:quizId/save')
	// Save incoming userAnswers to the quiz
	// req.body = {"1": "ABC", "2": "A", ...} must be provided (json)
	.put(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId } = req.params
			const userAnswers = req.body
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			if (!userAnswers) {
				throw ReferenceError('req.body needs to be provided')
			}
			const user = await User.findUserByEmail(email)
			const quizData = await Quiz.saveAnswersInSubmission(
				quizId,
				user._id,
				userAnswers
			)
			res.status(200).json(quizData)
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

router
	.route('/:quizId/grade')
	// Grade and finish a quiz that was in progress
	.post(isAuthenticated, async (req, res) => {
		try {
			const { email } = req
			const { quizId } = req.params
			if (!email) {
				throw ReferenceError('req.email needs to be provided')
			}
			const user = await User.findUserByEmail(email)
			const graded = await Quiz.gradeSubmission(quizId, user._id)

			res.status(200).json(graded)
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

module.exports = router
