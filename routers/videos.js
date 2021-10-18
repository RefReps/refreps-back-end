const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const conn = require('./../server/dbConnection')
const videoQuery = require('./../utils/videoQuery')
const verifyToken = require('../utils/middleware/verifyToken')
const verifyUser = require('../utils/middleware/verifyUser')
const upload = require('../utils/middleware/server-upload')

// Handling Video Requests for the front-end
// -----------------------------------------

// get list of videos
router.route('/').get(verifyToken, verifyUser.admin, async (req, res) => {
	let amount = req.query.amount ? req.query.amount : 20
	let type = req.query.type ? req.query.type : ''
	let doc = await videoQuery.queryVideos(10)
	res.json(doc)
})

// get metadata for a single video for the video player
router.route('/:id/data').get(verifyToken, async (req, res) => {
	res.json(await videoQuery.queryById(req.params.id))
})

// stream a video from the given id
router.route('/:id').get(verifyToken, (req, res) => {
	// need api call to some api streaming
})

// Main page to view all of the videos in the db
// ---------------------------------------------

router
	.route('/upload')
	.post(verifyToken, verifyUser.admin, upload, async (req, res) => {
		// TODO: Authenticate user posting video
		// TODO: upload video to cloud service, then store meta data in db
		return res.json({ status: 'OK' })
	})

router.route('/test').get(async (req, res) => {
	let type = req.query.type
	let limit = parseInt(req.query.limit)
	try {
		let doc = await videoQuery.queryVideosType(type, limit)
		res.json(doc)
	} catch (err) {
		console.log(err)
	}
})

module.exports = router
