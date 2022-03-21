const Course = require('../../database/models/course.model')
const User = require('../../database/models/user.model')
const { makeFakeCourse, makeFakeUser } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeFindCourseForStudent = require('./findCourseForStudent')

describe.skip('findCourseById Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const findCourseForStudent = makeFindCourseForStudent({ Course, User })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Course.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds a course by id', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))

		const found = await findCourseById(course1._id)
		expect(found).toMatchObject({
			found: 1,
			course: course1,
		})
	})


})
