const { sectionInfo, sectionSchema } = require('../../schemas/section')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

describe('sectionInfo', () => {
	it('should contain correct key-values', () => {
		expect(sectionInfo).toMatchObject({
			sectionName: {
				type: String,
				default: 'Section not named',
			},
			isViewable: {
				type: Boolean,
				defaule: true,
			},
			modules: {
				type: [ObjectId],
				default: [],
			},
		})
	})
})

describe('sectionSchema', () => {
	it('should build correctly into a mongo model', (done) => {
		expect.assertions(0)
		mongoose.model('Section', sectionSchema)
		done()
	})
})
