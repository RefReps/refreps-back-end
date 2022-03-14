const { Schema, model, Types } = require('mongoose')

const quizSubmission = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		quizId: {
			type: Types.ObjectId,
			ref: 'Quiz',
			required: true,
		},
		quizVersionId: {
			type: Types.ObjectId,
			ref: 'QuizVersion',
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
		userAnswers: [
			{
				questionNumber: {
					type: Number,
					required: true,
				},
				answers: {
					type: [String],
				},
			},
		],
		answerOverrides: [
			{
				questionNumber: {
					type: Number,
					required: true,
				},
				isCorrect: {
					type: Boolean,
					required: true,
				},
				isPointDifferent: {
					type: Boolean,
					default: false,
				},
				pointAward: {
					type: Number,
					default: 0,
				},
			},
		],
		isGraded: {
			type: Boolean,
			default: false,
		},
		grade: {
			type: Number,
			default: 0,
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
