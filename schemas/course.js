const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Null, Undefined } = mongoose.Types

const contentInfo = {
	toContentId: {
		type: ObjectId,
	},
	name: {
		type: String,
		default: 'Empty Name',
	},
	order: {
		type: Number,
	},
	contentType: {
		type: String,
		default: 'No Type',
	},
}

const moduleInfo = {
	moduleName: {
		type: String,
		default: 'Not named module.',
	},
	lectureDropDate: {
		type: Date,
		default: null,
	},
	isViewable: {
		type: Boolean,
		default: true,
	},
	content: {
		type: [new Schema(contentInfo)],
		default: [],
	},
}

const sectionsInfo = {
	sectionName: {
		type: String,
		default: 'Section not named',
	},
	isViewable: {
		type: Boolean,
		defaule: true,
	},
	modules: {
		type: [new Schema(moduleInfo)],
		default: [],
	},
}

const authorInfo = {
	authorId: {
		type: ObjectId,
		default: Undefined,
	},
}

const studentInfo = {
	studentId: {
		type: ObjectId,
		default: Undefined,
	},
}

const settingsInfo = {
	isEnforcements: {
		type: Boolean,
		default: true,
	},
	enforcementPercent: {
		type: Number,
		default: 90,
		max: 100,
		min: 0,
	},
	isGradedQuizAdvance: {
		type: Boolean,
		default: true,
	},
	maximumQuizAttempts: {
		type: Number,
		default: 2,
		min: 1,
		max: 99,
	},
	logo: {
		type: String,
		default: undefined,
	},
}

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
		type: [new Schema(sectionsInfo)],
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
		type: new Schema(settingsInfo),
	},
}

const courseSchema = new Schema(courseInfo, {
	timestamps: true,
})

module.exports.courseSchema = courseSchema
module.exports.courseInfo = courseInfo
