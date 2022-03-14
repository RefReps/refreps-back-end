const { Schema, model, Types } = require('mongoose')

const courseSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 6,
			maxlength: 120,
		},
		isTemplate: {
			type: Boolean,
			default: false,
			required: true,
		},
		isPublished: {
			type: Boolean,
			default: true,
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			required: true,
		},
		studentCourseCode: {
			code: {
				type: String,
				default: '',
			},
			activeUntil: {
				type: Date,
				default: Date.now(),
			},
			isLocked: {
				type: Boolean,
				default: false,
			},
		},
		settings: {
			isEnforcements: {
				type: Boolean,
				default: true,
				required: true,
			},
			enforcementPercent: {
				type: Number,
				default: 90,
				max: 100,
				min: 0,
				required: true,
			},
			isGradedQuizAdvance: {
				type: Boolean,
				default: true,
				required: true,
			},
			maximumQuizAttempts: {
				type: Number,
				default: 2,
				min: 1,
				max: 99,
				required: true,
			},
			courseCapacity: {
				type: Number,
				default: 30,
				min: 0,
			},
		},
		authors: [
			{
				type: Types.ObjectId,
				ref: 'User',
			},
		],
		students: [
			{
				type: Types.ObjectId,
				ref: 'User',
			},
		],
		sections: [
			{
				type: Types.ObjectId,
				ref: 'Section',
			},
		],
	},
	{ timestamps: true }
)

module.exports = model('Course', courseSchema)
