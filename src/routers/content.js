const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')

const { updateContentDropDate } = require('../middleware/content')
const {
	isAuthenticated,
	bindUserIdFromEmail,
} = require('../utils/middleware/index')

router.use(isAuthenticated, bindUserIdFromEmail)

router
	.route('/')
	// findAllContents
	.get(async (req, res) => {
		try {
			const { moduleId } = req.query
			if (!moduleId) {
				throw new ReferenceError('query for moduleId must be provided')
			}
			const result = await useCases.Content.findAllContents(moduleId)
			res.send(result.contents)
		} catch (error) {
			res.status(400).send(error.message)
		}
	})
	// addContent
	.post(multer.none(), async (req, res) => {
		try {
			const {
				name,
				toDocument,
				onModel,
				moduleId,
				isPublished,
				contentOrder,
				dropDate,
			} = req.body
			const contentData = req.body
			const result = await useCases.Content.addContent(contentData)
			await useCases.Content.collapseContent(moduleId)
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
			const result = await useCases.Content.findContentById(contentId)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// deleteContent
	.delete(async (req, res) => {
		const { contentId } = req.params
		try {
			const content = await useCases.Content.findContentById(contentId)
			await useCases.Content.deleteContent(contentId)
			await useCases.Content.collapseContent(content.moduleId)
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
				await useCases.Content.moveContentOrder(contentId, contentOrder)
				const content = await useCases.Content.findContentById(contentId)
				await useCases.Content.collapseContent(content.moduleId)
			}

			const contentInfo = {}
			contentInfo['name'] = name ? name : undefined
			contentInfo['isPublished'] = isPublished ? isPublished : undefined
			contentInfo['dropDate'] = dropDate ? dropDate : undefined
			const result = await useCases.Content.updateContent(
				contentId,
				contentInfo
			)
			res.send(result)
		} catch (error) {
			res.status(400).send(error.toString())
		}
	})

router
	.route('/:contentId/date')
	.put(multer.none(), updateContentDropDate, (req, res) => {
		return res.status(201).json({ success: true })
	})

module.exports = router
