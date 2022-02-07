const { Schema, model, Types } = require('mongoose')

const quizSubmission = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			required: true,
		},
		quizId: {
			type: Types.ObjectId,
			required: true,
		},
		submitted: {
			type: Boolean,
			required: true,
		},
		submissionNumber: {
			type: Number,
			required: true,
		},
		userAnswers: {
			type: Object,
			default: {},
		},
		isGraded: {
			type: Boolean,
			default: false,
		},
		grade: {
			type: Types.Decimal128,
			default: 0.0,
		},
		dateStarted: {
			type: Date,
			required: true,
		},
		dateFinished: {
			type: Date,
		},
	},
	{ timestamps: true }
)

module.exports = model('QuizSubmission', quizSubmission)
