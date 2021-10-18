const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			min: 6,
			max: 255,
		},
		email: {
			type: String,
			required: true,
			max: 255,
			min: 6,
		},
		password: {
			type: String,
			required: true,
			max: 1024,
			min: 6,
		},
		lastLoginDate: {
			type: Date,
			default: Date.now,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isSales: {
			type: Boolean,
			default: false,
		},
		isAuthor: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

module.exports = userSchema
