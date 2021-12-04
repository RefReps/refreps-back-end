const Video = require('../../database/models/video.model')

const makeAddVideo = require('./addVideo')
const makeFindVideoById = require('./findVideoById')

const addVideo = makeAddVideo({ Video })
const findVideoById = makeFindVideoById({ Video })

module.exports = {
	addVideo,
	findVideoById,
}
