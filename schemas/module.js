const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const moduleInfo = {
	moduleName: {
		type: String,
		required: true,
	},
	templateModule: {
		type: Boolean,
		default: false,
	},
	parentModule: {
		type: ObjectId,
		default: null,
	},
}

const moduleSchema = new Schema(moduleInfo, { timestamps: true })

module.exports.moduleSchema = moduleSchema
module.exports.moduleInfo = moduleInfo
