const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')

router
	.route('/')
	.get(async (req, res) => {
		try {
			const { courseId } = req.query
			if (!courseId) {
				throw new ReferenceError('query for courseId must be provided')
			}
			const result = await useCases.section.findAllSections(courseId)
			res.send(result)
		} catch (error) {
			res.status(400).send(error.message)
		}
	})
	.post(multer.none(), async (req, res) => {
		try {
			const result = await useCases.section.addSection(req.body)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:sectionId')
	.get(async (req, res) => {
		try {
		} catch (error) {
			res.status(400).send(error)
		}
	})
	.delete(async (req, res) => {
		try {
		} catch (error) {
			res.status(400).send(error)
		}
	})
	.put(multer.none(), async (req, res) => {
		try {
			const { sectionId } = req.params
			const result = await useCases.section.updateSection(sectionId, req.body)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})

module.exports = router
