const { Schema, model, Types } = require('mongoose')

const quizSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
)

module.exports = model('Quiz', quizSchema)
