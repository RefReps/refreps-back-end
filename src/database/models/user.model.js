const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			default: '',
			minlength: 0,
			maxlength: 256,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			default: '',
			minlength: 1,
			maxlength: 256,
		},
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
		authorCourses: [
			{
				type: Types.ObjectId,
				ref: 'Course',
			},
		],
		studentCourses: [
			{
				type: Types.ObjectId,
				ref: 'Course',
			},
		],
	},
	{ timestamps: true }
)

module.exports = model('User', userSchema)
