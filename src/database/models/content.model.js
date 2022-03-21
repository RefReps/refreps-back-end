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
		contentOrder: {
			type: Number,
			min: 1,
			required: true,
		},
		dropDate: {
			type: Date,
			default: null,
		},
		studentsCompleted: [{ type: Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
)

module.exports = model('Content', moduleSchema)
