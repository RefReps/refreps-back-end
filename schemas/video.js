const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoInfo = {
	fieldname: {
		type: String,
	},
	originalname: {
		type: String,
	},
	encoding: {
		type: String,
	},
	mimetype: {
		type: String,
	},
	destination: {
		type: String,
	},
	filename: {
		type: String,
	},
	path: {
		type: String,
	},
	size: {
		type: Number,
	},
}

const videoSchema = new Schema(videoInfo, { timestamps: true })

module.exports.videoSchema = videoSchema
module.exports.videoInfo = videoInfo
