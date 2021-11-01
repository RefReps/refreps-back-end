const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const { sectionInfo } = require('./section')
const { authorInfo } = require('./author')
const { studentInfo } = require('./student')
const { settingInfo } = require('./setting')

const courseInfo = {
	courseName: {
		type: String,
		default: 'Course not nammed',
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
		default: null,
	},
}

const courseSchema = new Schema(courseInfo, {
	timestamps: true,
})

module.exports.courseSchema = courseSchema
module.exports.courseInfo = courseInfo
