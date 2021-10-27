const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

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
		type: [ObjectId],
		default: [],
	},
}

const moduleSchema = new Schema(moduleInfo, { timestamps: true })

module.exports.moduleSchema = moduleSchema
module.exports.moduleInfo = moduleInfo
