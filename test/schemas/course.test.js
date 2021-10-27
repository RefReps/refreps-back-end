const {
	courseInfo,
	courseSchema,
	settingsInfo,
} = require('../../schemas/course')
const { ObjectId } = require('mongoose').Types
const mongoose = require('mongoose')

describe('courseInfo', () => {
	it('should contain correct key-values', () => {
		expect(courseInfo).toMatchObject({
			courseName: {
				type: String,
				required: true,
				min: 6,
			},
			isTemplateCourse: {
				type: Boolean,
				default: false,
			},
			sections: {
				type: [ObjectId],
				default: [],
			},
			authors: {
				type: [ObjectId],
				default: [],
			},
			students: {
				type: [ObjectId],
				default: [],
			},
			settings: {
				type: ObjectId,
			},
		})
	})
})

describe('courseSchema', () => {
	it('should build correctly into a mongo model', (done) => {
		expect.assertions(0)
		mongoose.model('Course', courseSchema)
		done()
	})
})
