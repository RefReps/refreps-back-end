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
	toContent: {
		type: ObjectId,
		required: true,
		refPath: 'onModel', // Used for .populate() on a video doc
	},
	onModel: {
		// Used to reference what collection the content is in
		type: String,
		required: true,
		enum: ['Video', 'Quiz'],
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
