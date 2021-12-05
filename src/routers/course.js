const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')

router
	.route('/')
	.get(async (req, res) => {
		try {
			const result = await useCases.course.findAllCourses()
			res.send(result.courses)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	.post(multer.none(), async (req, res) => {
		try {
			const course = await useCases.course.addCourse(req.body)
			res.send(course)
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:courseId')
	.get(async (req, res) => {
		try {
			const { courseId } = req.params
			const result = await useCases.course.findCourseById(courseId)
			res.send(result.course)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	.delete(async (req, res) => {
		try {
			const { courseId } = req.params
			const result = await useCases.course.deleteCourse(courseId)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	.put(multer.none(), async (req, res) => {
		try {
			const { courseId } = req.params
			const result = await useCases.course.updateCourse(courseId, req.body)
			res.send(result.course)
		} catch (error) {
			res.status(400).send(error)
		}
	})

module.exports = router
