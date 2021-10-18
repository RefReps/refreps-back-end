const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const moduleSchema = Schema(
	{
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
	},
	{ timestamps: true }
)

module.exports = moduleSchema
