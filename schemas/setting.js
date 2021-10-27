const mongoose = require('mongoose')
const Schema = mongoose.Schema

const settingInfo = {
	isEnforcements: {
		type: Boolean,
		default: true,
	},
	enforcementPercent: {
		type: Number,
		default: 90,
		max: 100,
		min: 0,
	},
	isGradedQuizAdvance: {
		type: Boolean,
		default: true,
	},
	maximumQuizAttempts: {
		type: Number,
		default: 2,
		min: 1,
		max: 99,
	},
	logo: {
		type: String,
		default: '',
	},
}

const settingSchema = new Schema(settingInfo, {
	timestamps: true,
})

module.exports.settingSchema = settingSchema
module.exports.settingInfo = settingInfo
