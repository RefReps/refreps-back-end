const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const { contentInfo } = require('./content')

const moduleInfo = {
	moduleName: {
		type: String,
		default: 'Not named module.',
	},
	orderInSection: {
		type: Number,
		default: -1,
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

const moduleSchema = new Schema(moduleInfo, { timestamps: true })

module.exports.moduleSchema = moduleSchema
module.exports.moduleInfo = moduleInfo
