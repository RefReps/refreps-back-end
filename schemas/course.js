const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const courseInfo = {
	courseName: {
		type: String,
		required: true,
		min: 6,
	},
	isTemplateCourse: {
		// Template Courses can not have their videos deleted by authors
		type: Boolean,
		default: false,
	},
	sections: {
		type: [ObjectId],
		default: [],
	},
	authors: {
		type: [ObjectId],
		default: [],
	},
	students: {
		type: [ObjectId],
		default: [],
	},
	settings: {
		// changable by authors
		type: ObjectId,
	},
}

const courseSchema = new Schema(courseInfo, {
	timestamps: true,
})

module.exports.courseSchema = courseSchema
module.exports.courseInfo = courseInfo
