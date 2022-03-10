const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeAddCourseCode = require('./addCourseCode')

describe('findCourseById Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const addCourseCode = makeAddCourseCode({ Course })

	const COURSE_CODE = makeFakeCourse().studentCourseCode.code

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Course.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a course code.', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))

		const { course } = await addCourseCode(course1._id, 'MHS-2022')
		expect(course.studentCourseCode.code).toBe('MHS-2022')
	})

	it('updates the correct course code given multiple courses', async () => {
		const course1 = await addCourse(
			makeFakeCourse({ name: 'course1', studentCourseCode: { code: 'AAAAAA' } })
		)
		const course2 = await addCourse(
			makeFakeCourse({
				name: 'course2',
				studentCourseCode: { code: 'BBBBBB' },
			})
		)
		const course3 = await addCourse(
			makeFakeCourse({ name: 'course3', studentCourseCode: { code: 'CCCCCC' } })
		)

		const { course } = await addCourseCode(course2._id, 'NEW-CODE')
		expect(course.studentCourseCode.code).toBe('NEW-CODE')
	})

	it('rejects when a course is not found', async () => {
		await expect(
			addCourseCode('622a3b319a2ca2699ae1a0d2', 'YIKES')
		).rejects.toThrow(ReferenceError('Course doc not found.'))
	})

	it('rejects when `courseId` is not provided.', async () => {
		await expect(addCourseCode()).rejects.toThrow(
			ReferenceError('`courseId` must not be empty.')
		)
	})

	it('rejects when `code` is not provided.', async () => {
		await expect(addCourseCode('622a3b319a2ca2699ae1a0d2')).rejects.toThrow(
			ReferenceError('`code` must not be empty.')
		)
	})

	it('rejects when the code being added is already a code to another course', async () => {
		await addCourse(
			makeFakeCourse({
				name: 'course1',
				studentCourseCode: { code: COURSE_CODE },
			})
		)
		const course2 = await addCourse(makeFakeCourse({ name: 'course2' }))

		await expect(addCourseCode(course2._id, COURSE_CODE)).rejects.toThrow(
			Error('`code` is already in use.')
		)
	})
})
