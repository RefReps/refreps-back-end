// express router
const express = require('express')
const router = express.Router()

// middleware
const multer = require('multer')()
const {
	authorizeAdmin,
	isAuthenticated,
	bindUserIdFromEmail,
} = require('../utils/middleware/index')

// utils

// use cases
const { Announcement, Content, Course } = require('../use-cases')

router.use(isAuthenticated)

// routes

router
	// @route   POST api/announcement
	// @desc    Create an announcement on a content
	// @access  Authenticated
	.post('/', multer.none(), async (req, res) => {
		try {
			const { title, body, moduleId } = req.body
			// if not moduleId, throw error
			if (!moduleId) {
				throw new ReferenceError('query for moduleId must be provided')
			}

			const { announcement } = await Announcement.addAnnouncement({
				title: title ? title : 'Announcement',
				body: body ? body : 'Announcement body',
			})

			// create a new content
			const { content } = await Content.addContent({
				name: announcement.title,
				toDocument: announcement._id,
				onModel: 'Announcement',
				moduleId: moduleId,
				isPublished: true,
				isKeepOpen: false,
				contentOrder: 200,
			})
			await Content.collapseContent(moduleId)

			res.status(200).send({ _id: announcement._id })
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	// @route   GET api/announcement/:announcementId
	// @desc    Get an announcement by id
	// @access  Authenticated
	.get('/:announcementId', async (req, res) => {
		try {
			const { announcementId } = req.params
			const result = await Announcement.findAnnouncementById(announcementId)
			res.status(200).json({ announcement: result.announcement })
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// @route   PUT api/announcement/:announcementId
	// @desc    Update an announcement by id
	// @access  Authenticated
	.put('/:announcementId', multer.none(), async (req, res) => {
		try {
			const { announcementId } = req.params
			const { title, body } = req.body
			const result = await Announcement.updateAnnouncement(announcementId, {
				title: title ? title : undefined,
				body: body,
			})
			res.status(200).json({ announcement: result.announcement })
		} catch (error) {
			res.status(400).send(error)
		}
	})

// export router
module.exports = router
