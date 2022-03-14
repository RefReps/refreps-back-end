const { Schema, model, Types } = require('mongoose')

const quizVersionSchema = new Schema(
	{
		questions: [
			{
				questionNumber: {
					type: Number,
					required: true,
				},
				question: {
					type: String,
					required: true,
				},
				responses: {
					// e.g. 'A' => 'Answer 1', 'B' => 'Answer 2'
					type: Map,
					of: String,
				},
				answers: {
					// Refers to correct keys in `responses` e.g. ['A', 'B']
					type: [String],
				},
				questionType: {
					type: String,
					enum: ['1_CHOICE', 'MULTI_CHOICE', 'FREE_RESPONSE', 'TRUE_FALSE'],
				},
				points: {
					type: Number,
					min: 0,
					default: 1,
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
