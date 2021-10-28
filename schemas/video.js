const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoInfo = {
	fieldname: {
		type: String,
		required: true,
	},
	originalname: {
		type: String,
		required: true,
	},
	encoding: {
		type: String,
		required: true,
	},
	mimetype: {
		type: String,
		required: true,
	},
	destination: {
		type: String,
		required: true,
	},
	filename: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
}

const videoSchema = new Schema(videoInfo, { timestamps: true })

module.exports.videoSchema = videoSchema
module.exports.videoInfo = videoInfo
