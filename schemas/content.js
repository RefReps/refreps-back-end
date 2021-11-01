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
		default: -1,
	},
	contentType: {
		type: String,
		default: 'No Type', //Values: video, quiz, article
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
