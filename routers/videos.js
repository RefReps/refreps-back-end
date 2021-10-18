const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const conn = require('./../server/dbConnection')
const videoQuery = require('./../utils/videoQuery')

// Handling Video Requests for the front-end
// -----------------------------------------

// get list of videos
router.route('/').get(async (req, res) => {
	let doc = await videoQuery.queryVideos(10)
	res.json(doc)
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

router.route('/new').post((req, res) => {
	// TODO: Authenticate user posting video
	// TODO: upload video to cloud service, then store meta data in db
	let Video = conn.models.Video
	Video.create({
		title: 'Basketball 1',
		url: 'https://youtube.com',
		types: ['basketball'],
	})
	res.json({ msg: 'success' })
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
	req.session.viewCount += 1
	res.json({ msg: `viewCount: ${req.session.viewCount}` })
})

module.exports = router
