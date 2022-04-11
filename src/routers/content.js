const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')
const { Course, User, Content } = useCases

const { updateContentDropDate } = require('../middleware/content')
const {
	isAuthenticated,
	bindUserIdFromEmail,
	authorizeAdmin,
} = require('../utils/middleware/index')
const { buildErrorResponse } = require('../utils/responses')

const contentMiddleware = require('../middleware/content')

router.use(isAuthenticated, bindUserIdFromEmail)

router
	.route('/')
	// findAllContents
	// TODO: add is author route only
	.get(async (req, res) => {
		try {
			const { moduleId } = req.query
			if (!moduleId) {
				throw new ReferenceError('query for moduleId must be provided')
			}
			const result = await useCases.Content.findAllContents(moduleId, {
				publishedOnly: false,
			})
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

// JSON BODY
// updates the authenticated user's content progression.
// Returns the percentComplete for the content
router.route('/:contentId/progress/video').put(async (req, res) => {
	try {
		const { contentId } = req.params
		const { percentComplete } = req.body

		// check if percentComplete is a number
		if (isNaN(percentComplete)) {
			throw new Error('req.percentComplete must be a number')
		}

		const content = await Content.findContentById(contentId)
		if (!(content.onModel == 'Video')) {
			throw new Error('Only video progress is allowed to be updated.')
		}

		// check if user is in the course
		const user = await User.findUserById(req.userId)
		const { course } = await Course.findCourseByContentId(contentId)
		if (!user.studentCourses.find((c) => c._id.equals(course._id))) {
			throw new Error('User is not a student in the course.')
		}

		const { studentComplete } = await Content.markCompleteForStudent(
			contentId,
			req.userId,
			percentComplete
		)
		return res
			.status(200)
			.json({ percentComplete: studentComplete.percentComplete })
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
})

router
	.route('/:contentId/progress')
	// get all students progress for a content (only those students in the course)
	.get(async (req, res) => {
		try {
			const { contentId } = req.params
			const { students, content, course } = await Content.studentsProgress(
				contentId
			)
			res.status(200).json({ students, content, course })
		} catch (error) {
			return res.status(400).json(buildErrorResponse(error))
		}
	})
	// Admin only route
	// update a student's progress on a content
	// acts as a force complete for a content if percentComplete=100
	.put(authorizeAdmin, async (req, res) => {
		try {
			const { contentId } = req.params
			const { userId, percentComplete } = req.body
			const { studentComplete } = await Content.markCompleteForStudent(
				contentId,
				userId,
				percentComplete,
				true
			)
			return res
				.status(200)
				.json({ percentComplete: studentComplete.percentComplete })
		} catch (error) {
			return res.status(400).json({ success: false })
		}
	})

// Author route for publishing content
router
	.route('/:contentId/publish')
	.put(contentMiddleware.toggleContentPublished, async (req, res) => {
		res.status(200).json({ success: true })
	})

// Author route for toggling content being kept open
router
	.route('/:contentId/keep-open')
	.put(contentMiddleware.toggleContentKeepOpen, async (req, res) => {
		res.status(200).json({ success: true })
	})

module.exports = router
