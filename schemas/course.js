const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = Schema(
	{
		title: {
			type: String,
			required: true,
			min: 6,
		},
		templateCourse: {
			type: Boolean,
			default: false,
		},
		description: {
			type: String,
			default: 'No description set',
		},
		modules: {
			type: Array,
			required: [],
		},
		authors: {
			type: Array,
			default: [],
		},
		students: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
)

module.exports = courseSchema
