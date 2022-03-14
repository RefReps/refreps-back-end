const { Schema, model, Types } = require('mongoose')

const quizSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		quizVersions: [
			{
				type: Types.ObjectId,
				ref: 'QuizVersion',
			},
		],
		activeVersion: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = model('Quiz', quizSchema)
