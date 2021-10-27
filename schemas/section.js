const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Null, Undefined } = mongoose.Types

const sectionInfo = {
	sectionName: {
		type: String,
		default: 'Section not named',
	},
	isViewable: {
		type: Boolean,
		defaule: true,
	},
	modules: {
		type: [ObjectId],
		default: [],
	},
}

const sectionSchema = new Schema(sectionInfo, {
	timestamps: true,
})

module.exports.sectionSchema = sectionSchema
module.exports.sectionInfo = sectionInfo
