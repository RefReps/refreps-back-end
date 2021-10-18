const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = Schema(
	{
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
	},
	{ timestamps: true }
)

module.exports = videoSchema
