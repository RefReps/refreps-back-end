const { Schema, model, Types } = require('mongoose')

const moduleSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 120,
		},
		sectionId: {
			type: Types.ObjectId,
			required: true,
		},
		isPublished: {
			type: Boolean,
			required: true,
			default: true,
		},
		moduleOrder: {
			type: Number,
			min: 1,
			required: true,
		},
		dropDate: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
)

module.exports = model('Module', moduleSchema)
