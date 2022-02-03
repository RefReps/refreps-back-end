const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')
const quizJson = require('../utils/quiz/quizJson')

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
			const quiz = await useCases.quiz.addQuiz({ name })
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
			const quiz = await useCases.quiz.findQuizById(quizId)
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
	.post(multer.none(), async (req, res) => {
		try {
			const { quizId } = req.params
			const { questionNumber, type, question, answers, answer, A, B, C, D } =
				req.body
			responses = {
				A,
				B,
				C,
				D,
			}

			const quiz = await useCases.quiz.findQuizById(quizId)
			const result = await useCases.quiz.addQuestion(
				quiz._id,
				questionNumber || 100,
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

router.route('/:quizId/:questionNumber').delete(async (req, res) => {
	try {
		const { quizId, questionNumber } = req.params
		await useCases.quiz.deleteQuestion(quizId, questionNumber)
		return res.status(201).send({ success: true })
	} catch (err) {
		return res
			.status(400)
			.send({ success: false, error: err.name, reason: err.message })
	}
})

router.route('/:courseId/copy').post(multer.none(), async (req, res) => {
	try {
		res.status(201).send()
	} catch (error) {
		res.status(400).send(error)
	}
})

module.exports = router
