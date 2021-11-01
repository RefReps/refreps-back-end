const router = require('express').Router()

// connection import
const conn = require('../utils/mongodb/dbConnection')

// Handling Video Requests for the front-end
// -----------------------------------------

router
	.route('/')
	// Get documents of all videos in the database
	.get((req, res) => {
		res.json({ msg: 'Get a list of all videos in the database' })
	})
	// Post a new video in the database AND upload directory
	.post((req, res) => {
		res.json({ msg: 'Post a new video in the database and upload dir' })
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
