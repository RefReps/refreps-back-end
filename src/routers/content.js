const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')

router
	.route('/')
	// findAllContents
	.get(async (req, res) => {
		try {
			const { moduleId } = req.query
			if (!moduleId) {
				throw new ReferenceError('query for moduleId must be provided')
			}
			const result = await useCases.content.findAllContents(moduleId)
			res.send(result.contents)
		} catch (error) {
			res.status(400).send(error.message)
		}
	})
	// addContent
	.post(multer.none(), async (req, res) => {
		try {
			const result = await useCases.content.addContent(req.body)
			await useCases.content.collapseContent(req.body.moduleId)
			res.status(204).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:contentId')
	// findContentById
	.get(async (req, res) => {
		try {
			const { contentId } = req.params
			const result = await useCases.content.findContentById(contentId)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// deleteContent
	.delete(async (req, res) => {
		const { contentId } = req.params
		try {
			const content = await useCases.content.findContentById(contentId)
			await useCases.content.deleteContent(contentId)
			await useCases.content.collapseContent(content.moduleId)
			res.status(204).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// updateContent
	.put(multer.none(), async (req, res) => {
		// Update order if req.body.contentOrder
		const { contentId } = req.params
		const { name, moduleId, isPublished, contentOrder, dropDate } = req.body
		try {
			if (contentOrder) {
				await useCases.content.moveContentOrder(contentId, contentOrder)
				const content = await useCases.content.findContentById(contentId)
				await useCases.content.collapseContent(content.moduleId)
			}

			const contentInfo = {}
			contentInfo['name'] = name ? name : undefined
			contentInfo['isPublished'] = isPublished ? isPublished : undefined
			contentInfo['dropDate'] = dropDate ? dropDate : undefined
			const result = await useCases.content.updateContent(
				contentId,
				contentInfo
			)
			res.send(result)
		} catch (error) {
			res.status(400).send(error.toString())
		}
	})

module.exports = router
