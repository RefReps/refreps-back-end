const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')

router
	.route('/')
	// findAllSections
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
	// addSection
	.post(multer.none(), async (req, res) => {
		try {
			const result = await useCases.section.addSection(req.body)
			await useCases.section.collapseSection(req.body.courseId)
			res.status(204).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:sectionId')
	// findSectionById
	.get(async (req, res) => {
		try {
			const { sectionId } = req.params
			const result = await useCases.section.findSectionById(sectionId)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// deleteSection
	.delete(async (req, res) => {
		const { sectionId } = req.params
		try {
			const section = await useCases.section.findSectionById(sectionId)
			await useCases.section.deleteSection(sectionId)
			await useCases.section.collapseSection(section.courseId)
			res.status(204).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// updateSection
	.put(multer.none(), async (req, res) => {
		// Update order if req.body.sectionOrder
		const { sectionId } = req.params
		const { name, courseId, isPublished, sectionOrder, dropDate } = req.body
		try {
			if (sectionOrder) {
				await useCases.section.moveSectionOrder(sectionId, sectionOrder)
				const section = await useCases.section.findSectionById(sectionId)
				await useCases.section.collapseSection(section.courseId)
			}

			const sectionInfo = {}
			sectionInfo['name'] = name ? name : undefined
			sectionInfo['isPublished'] = isPublished ? isPublished : undefined
			sectionInfo['dropDate'] = dropDate ? dropDate : undefined
			const result = await useCases.section.updateSection(
				sectionId,
				sectionInfo
			)
			res.send(result)
		} catch (error) {
			res.status(400).send(error.toString())
		}
	})

module.exports = router
