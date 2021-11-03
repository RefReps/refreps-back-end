const router = require('express').Router()

// connection import
const conn = require('../utils/mongodb/dbConnection')
const upload = require('../utils/middleware/server-upload')
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
			await conn.openUri(db_uri)
			await videodb.saveNewVideo(req.file)
			res.status(204).send()
		} catch (error) {
			res.status(400).json(error)
		}
	})

router
	.route('/:videoId')
	// Get the video file to stream
	.get((req, res) => {
		// need api call to some api streaming
		res.json({ msg: 'Get a specific video to stream' })
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
