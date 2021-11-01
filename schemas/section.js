const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Null, Undefined } = mongoose.Types

const { moduleInfo } = require('./module')

const sectionInfo = {
	sectionName: {
		type: String,
		default: 'Section not named',
	},
	orderInCourse: {
		type: Number,
		default: -1,
	},
	isViewable: {
		type: Boolean,
		default: true,
	},
	modules: {
		type: [new Schema(moduleInfo)],
		default: [],
	},
}

const sectionSchema = new Schema(sectionInfo, {
	timestamps: true,
})

module.exports.sectionSchema = sectionSchema
module.exports.sectionInfo = sectionInfo
