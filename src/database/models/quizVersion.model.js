const { Schema, model, Types } = require('mongoose')

const quizVersionSchema = new Schema(
	{
		questions: [
			{
				number: {
					type: Number,
					required: true,
				},
				responses: [
					{
						name: {
							type: String,
							required: true,
						},
					},
				],
				answers: [
					{
						type: String,
					},
				],
				questionType: {
					type: String,
					enum: ['1_CHOICE', 'MULTI_CHOICE', 'FREE_RESPONSE', 'TRUE_FALSE'],
				},
			},
		],
		versionNumber: {
			type: Number,
			required: true,
		},
		quizSubmissions: [
			{
				type: Types.ObjectId,
				ref: 'QuizSubmission',
			},
		],
	},
	{ timestamps: true }
)

module.exports = model('QuizVersion', quizVersionSchema)
