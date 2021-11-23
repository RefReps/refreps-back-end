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
		},
		moduleOrder: {
			type: Number,
			min: 0,
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
