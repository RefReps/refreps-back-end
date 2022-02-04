const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeCopyCourse = require('./copyCourse')

describe('copyCourse Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const copyCourse = makeCopyCourse({ Course })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Course.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully copies a course', async () => {
		const course = await addCourse(makeFakeCourse())
		const copy = await copyCourse(course._id, { name: course.name })
		expect(copy._id).not.toBe(course._id)
		expect({
			name: copy.name,
			isTemplate: copy.isTemplate,
			isPublished: copy.isPublished,
			isDeleted: copy.isDeleted,
			settings: copy.settings,
		}).toEqual({
			name: course.name,
			isTemplate: course.isTemplate,
			isPublished: course.isPublished,
			isDeleted: course.isDeleted,
			settings: course.settings,
		})
	})

	it('fails to copy if cannot find the course', async () => {
		let errorName = 'nothing'
		try {
			await copyCourse('61f9c07a5b333683766bae70')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fails to copy if invalid id', async () => {
		let errorName = 'nothing'
		try {
			await copyCourse('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})

	// it('fails to add a course that does not have valid properties', async () => {
	// 	let errorName = 'nothing'
	// 	try {
	// 		await addCourse(makeFakeCourse({ name: '' }))
	// 	} catch (error) {
	// 		errorName = error.name
	// 	}
	// 	expect(errorName).toBe('ValidationError')
	// })
})
