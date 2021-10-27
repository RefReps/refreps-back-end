const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Null, Undefined } = mongoose.Types

const contentInfo = {
	contentName: {
		type: String,
		default: 'Empty Name',
	},
	orderInModule: {
		type: Number,
	},
	contentType: {
		type: String,
		default: 'No Type',
	},
	toContent: {
		type: ObjectId,
		required: true,
	},
	data: {
		type: Array,
	},
}

const contentSchema = new Schema(contentInfo, {
	timestamps: true,
})

module.exports.contentSchema = contentSchema
module.exports.contentInfo = contentInfo
