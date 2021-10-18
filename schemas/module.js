const mongoose = require('mongoose')
const Schema = mongoose.Schema

const moduleSchema = Schema(
	{
		title: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		types: {
			type: Array,
			required: false,
		},
	},
	{ timestamps: true }
)

module.exports = moduleSchema
