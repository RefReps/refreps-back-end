const router = require('express').Router()

// connection import
const conn = require('../utils/mongodb/dbConnection')
const upload = require('../utils/middleware/server-upload')
const crudOperations = require('../utils/mongodb/crudOperations')
const courseware = require('../utils/mongodb/course')
require('dotenv').config({ path: '.env' })

const db_uri = process.env.DB_CONNECT

const videodb = require('../utils/mongodb/videodb')

// Handling Video Requests for the front-end
// -----------------------------------------

router
	.route('/')
	// Get documents of all videos in the database
	.get()
	// Post a new video in the database AND upload directory
	.post(upload.single('video'), async (req, res) => {
		try {
			const { courseId, sectionId, moduleId } = req.body
			if (!(courseId && moduleId && sectionId)) {
				throw new Error('Must have courseId, sectionId, and moduleId')
			}
			if (!req.hasOwnProperty('file'))
				throw new Error('req.file is needed to save video to db')
			await conn.openUri(db_uri)
			const videoDoc = await videodb.saveNewVideo(req.file)
			contentDoc = {
				contentName: req.file.originalname.split('.')[0],
				toContent: videoDoc._id,
				onModel: 'Video',
			}
			console.log('yo')
			await courseware.pushNewContent(courseId, sectionId, moduleId, contentDoc)
			res.status(200).send('uo')
		} catch (error) {
			res.status(400).json()
		} finally {
			conn.close()
		}
	})

router
	.route('/:videoId')
	// Get the video file to stream
	.get(async (req, res) => {
		// need api call to some api streaming
		try {
			await conn.openUri(db_uri)
			const videoDoc = await videodb.getVideoById(req.params.videoId)
			const videoObj = videoDoc.toObject()
			res.status(200).json(videoObj)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})
	// Delete a specific video in the database AND upload directory
	.delete((req, res) => {
		res.json({ msg: 'Delete a specific video and the directory' })
	})

router
	.route('/:videoId/data')
	// get metadata for a single video for the video player
	.get((req, res) => {
		res.json({ msg: 'Get metadata for a video in the db' })
	})

module.exports = router
