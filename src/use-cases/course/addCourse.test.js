const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')

describe('addCourse Test Suite', () => {
	const addCourse = makeAddCourse({ Course })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Course.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a course', async () => {
		addCourse(makeFakeCourse())
	})

	it('fails to add a course if not valid', async () => {
		let errorMessage = 'nothing'
		try {
			await addCourse(makeFakeCourse({ name: '' }))
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Course validation failed: name: Path `name` is required.'
		)
	})

	it('fails when no courseInfo is passed', async () => {
		let errorMessage = 'nothing'
		try {
			await addCourse()
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Course validation failed: name: Path `name` is required.'
		)
	})
})
