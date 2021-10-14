const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = Schema(
	{
		title: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

const Video = mongoose.model('Video', videoSchema)
module.exports = Video
