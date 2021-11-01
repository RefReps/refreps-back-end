const { courseInfo, courseSchema } = require('../../schemas/course')
const { ObjectId } = require('mongoose').Types
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { sectionInfo } = require('../../schemas/section')
const { authorInfo } = require('../../schemas/author')
const { studentInfo } = require('../../schemas/student')
const { settingInfo } = require('../../schemas/setting')

// describe('courseInfo', () => {
// 	it('should contain correct key-values', () => {
// 		expect(courseInfo).toMatchObject({
// 			courseName: {
// 				type: String,
// 				required: true,
// 				min: 6,
// 			},
// 			isTemplateCourse: {
// 				type: Boolean,
// 				default: false,
// 			},
// 			sections: {
// 				type: [new Schema(sectionInfo)],
// 				default: [],
// 			},
// 			authors: {
// 				type: [new Schema(authorInfo)],
// 				default: [],
// 			},
// 			students: {
// 				type: [new Schema(studentInfo)],
// 				default: [],
// 			},
// 			settings: {
// 				type: new Schema(settingInfo),
// 			},
// 		})
// 	})
// })

describe('courseSchema', () => {
	it('should build correctly into a mongo model', (done) => {
		expect.assertions(0)
		mongoose.model('Course', courseSchema)
		done()
	})
})
