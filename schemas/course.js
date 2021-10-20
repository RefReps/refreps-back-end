const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseInfo = {
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
		default: [],
	},
	authors: {
		type: Array,
		default: [],
	},
	students: {
		type: Array,
		default: [],
	},
}

const courseSchema = new Schema(courseInfo, { timestamps: true })

module.exports.courseSchema = courseSchema
module.exports.courseInfo = courseInfo
