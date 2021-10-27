const { moduleInfo, moduleSchema } = require('../../schemas/module')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

describe('moduleInfo', () => {
	it('should contain correct key-values', () => {
		expect(moduleInfo).toMatchObject({
			moduleName: {
				type: String,
				default: 'Not named module.',
			},
			lectureDropDate: {
				type: Date,
				default: null,
			},
			isViewable: {
				type: Boolean,
				default: true,
			},
			content: {
				type: [ObjectId],
				default: [],
			},
		})
	})
})

describe('moduleSchema', () => {
	it('should build correctly into a mongo model', (done) => {
		expect.assertions(0)
		mongoose.model('Module', moduleSchema)
		done()
	})
})
