const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema(
	{
		// firstName: {
		// 	type: String,
		// 	required: true,
		// 	trim: true,
		// 	minlength: 1,
		// 	maxlength: 120,
		// },
		// lastName: {
		// 	type: String,
		// 	required: true,
		// 	trim: true,
		// 	minlength: 1,
		// 	maxlength: 120,
		// },
		email: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		refreshTokens: {
			type: Array,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		authorCourses: {
			type: Array,
			default: [],
		},
		studentCourses: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
)

module.exports = model('User', userSchema)
