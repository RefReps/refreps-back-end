const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoInfo = {
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	url: {
		type: String,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	types: {
		type: Array,
		required: false,
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
}

const videoSchema = new Schema(videoInfo, { timestamps: true })

module.exports.videoSchema = videoSchema
module.exports.videoInfo = videoInfo
