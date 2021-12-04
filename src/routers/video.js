const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const videoUpload = require('../utils/server-upload')
const fs = require('fs')

const useCases = require('../use-cases/index')

router.route('/').post(videoUpload.single('video'), async (req, res) => {
	try {
		const { file } = req
		const video = await useCases.video.addVideo(file)
		res.send(video)
	} catch (error) {
		res.status(400).send(error)
	}
})

router
	.route('/:videoId')
	// Play a video from local server
	.get(async (req, res) => {
		const { videoId } = req.params

		const { range } = req.headers
		if (!range) {
			res.status(400).send('Requires Range Header')
		}

		// Find the video document in the db
		const video = await useCases.video.findVideoById(videoId)

		const { path } = video
		const videoSize = fs.statSync(path).size

		// Parse Range
		const CHUNK_SIZE = 10 ** 6 // 1MB
		const start = Number(range.replace(/\D/g, ''))
		const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

		// Create headers
		const contentLength = end - start + 1
		const headers = {
			'Content-Range': `bytes ${start}-${end}/${videoSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': contentLength,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(206, headers)

		const videoStream = fs.createReadStream(path, { start, end })

		videoStream.pipe(res)
	})

module.exports = router
