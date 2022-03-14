const { Schema, model, Types } = require('mongoose')

const sectionSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 120,
		},
		courseId: {
			type: Types.ObjectId,
			required: true,
		},
		isPublished: {
			type: Boolean,
			required: true,
			default: true,
		},
		sectionOrder: {
			type: Number,
			min: 1,
			required: true,
		},
		dropDate: {
			type: Date,
			default: null,
		},
		modules: [
			{
				type: Types.ObjectId,
				ref: 'Module',
			},
		],
	},
	{ timestamps: true }
)

module.exports = model('Section', sectionSchema)
