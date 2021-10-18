const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const conn = require('./../server/dbConnection')
const videoQuery = require('./../utils/videoQuery')
const verify = require('../utils/verifyToken')

// Handling Video Requests for the front-end
// -----------------------------------------

// get list of videos
router.route('/').get(verify, async (req, res) => {
	let user = await conn.models.User.findOne({ _id: req.user }).exec()
	if (!user.isAdmin) return res.status(401).send('Access Denied: Admins only')
	let doc = await videoQuery.queryVideos(10)
	res.send(doc)
})

// get metadata for a single video for the video player
router.route('/:id/data').get(async (req, res) => {
	res.json(await videoQuery.queryById(req.params.id))
})

// stream a video from the given id
router.route('/:id').get((req, res) => {
	// need api call to some api streaming
})

// Main page to view all of the videos in the db
// ---------------------------------------------
// router.route('/').get(async (req, res) => {
// 	let doc = await videoQuery.queryVideos(10)
// 	res.json(doc)
// })

router.route('/new').post(async (req, res) => {
	// TODO: Authenticate user posting video
	// TODO: upload video to cloud service, then store meta data in db
	let video = new conn.models.Video({
		title: 'Basketball 1',
		url: 'https://youtube.com',
		types: ['basketball'],
		duration: 400,
	})
	try {
		let savedVideo = await video.save()
		res.json({ video: video._id })
	} catch (err) {
		res.status(400).send(err)
	}
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

router.route('/upload').get((req, res) => {
	res.json({ msg: `viewCount: ${req.session.viewCount}` })
})

module.exports = router
