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
		toDocument: {
			type: Types.ObjectId,
			required: true,
			refPath: 'onModel',
		},
		onModel: {
			type: String,
			required: true,
			enum: ['Video', 'Quiz'],
		},
		moduleId: {
			type: Types.ObjectId,
			ref: 'Module',
			required: true,
		},
		isPublished: {
			type: Boolean,
			required: true,
			default: true,
		},
		isKeepOpen: {
			type: Boolean,
			required: true,
			default: false,
		},
		contentOrder: {
			type: Number,
			min: 1,
			required: true,
		},
		dropDate: {
			type: Date,
			default: null,
		},
		studentsCompleted: [
			{
				student: {
					type: Types.ObjectId,
					ref: 'User',
				},
				percentComplete: {
					type: Number,
					min: 0,
					max: 100,
				},
			},
		],
	},
	{ timestamps: true }
)

module.exports = model('Content', moduleSchema)
