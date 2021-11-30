const { Schema, model } = require('mongoose')

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
		},
	},
	{ timestamps: true }
)

module.exports = model('Course', courseSchema)
