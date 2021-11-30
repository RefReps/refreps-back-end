const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeUpdateCourse = require('./updateCourse')

describe('updateCourse Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const updateCourse = makeUpdateCourse({ Course })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Course.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully updates a course', async () => {
		const course1 = await addCourse(makeFakeCourse())

		const updated = await updateCourse(course1._id, { name: 'Updated Name' })
		expect(updated.course.name).toEqual('Updated Name')
	})

	it('successfully resolves when the course is not found', async () => {
		const updated = await updateCourse('6197ae39ef8716d0dd181e08')
		expect(updated).toMatchObject({ count: 0, course: {} })
	})

	it('rejects an error if no courseId is passed', async () => {
		let errorMessage = 'nothing'
		try {
			await updateCourse()
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe('`id` is required to update')
	})
})
