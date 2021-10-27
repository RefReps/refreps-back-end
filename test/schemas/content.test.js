const { contentInfo, contentSchema } = require('../../schemas/content')
const { ObjectId } = require('mongoose').Types
const mongoose = require('mongoose')

describe('contentInfo', () => {
	it('should contain correct key-values', () => {
		expect(contentInfo).toMatchObject({
			contentName: {
				type: String,
				default: 'Empty Name',
			},
			orderInModule: {
				type: Number,
			},
			contentType: {
				type: String,
				default: 'No Type',
			},
			toContent: {
				type: ObjectId,
				required: true,
			},
			data: {
				type: Array,
			},
		})
	})
})

describe('contentSchema', () => {
	it('should build correctly into a mongo model', (done) => {
		expect.assertions(0)
		mongoose.model('Content', contentSchema)
		done()
	})
})
