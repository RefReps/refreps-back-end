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
		type: [new Schema(sectionInfo)],
		default: [],
	},
	authors: {
		type: [new Schema(authorInfo)],
		default: [],
	},
	students: {
		type: [new Schema(studentInfo)],
		default: [],
	},
	settings: {
		// changable by authors
		type: new Schema(settingInfo),
		default: null,
	},
}

const courseSchema = new Schema(courseInfo, {
	timestamps: true,
})

module.exports.courseSchema = courseSchema
module.exports.courseInfo = courseInfo
