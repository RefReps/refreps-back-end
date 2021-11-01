const { settingInfo, settingSchema } = require('../../schemas/setting')
const mongoose = require('mongoose')

// describe('settingInfo', () => {
// 	it('should contain correct key-values', () => {
// 		expect(settingInfo).toMatchObject({
// 			isEnforcements: {
// 				type: Boolean,
// 				default: true,
// 			},
// 			enforcementPercent: {
// 				type: Number,
// 				default: 90,
// 				max: 100,
// 				min: 0,
// 			},
// 			isGradedQuizAdvance: {
// 				type: Boolean,
// 				default: true,
// 			},
// 			maximumQuizAttempts: {
// 				type: Number,
// 				default: 2,
// 				min: 1,
// 				max: 99,
// 			},
// 			logo: {
// 				type: String,
// 				default: '',
// 			},
// 		})
// 	})
// })

describe('settingSchema', () => {
	it('should build correctly into a mongo model', (done) => {
		expect.assertions(0)
		mongoose.model('Setting', settingSchema)
		done()
	})
})
