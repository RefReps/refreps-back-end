const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeFindCourseByCode = require('./findCourseByCode')

describe('findCourseById Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const findCourseByCode = makeFindCourseByCode({ Course })

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

	it('successfully finds a course by code', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))

		const found = await findCourseByCode(COURSE_CODE)
		expect(found).toMatchObject({
			course: course1,
		})
	})

	it('finds the right course given multiple entries', async () => {
		const course1 = await addCourse(
			makeFakeCourse({ name: 'course1', studentCourseCode: { code: 'BBBBBB' } })
		)
		const course2 = await addCourse(
			makeFakeCourse({
				name: 'course2',
				studentCourseCode: { code: COURSE_CODE },
			})
		)
		const course3 = await addCourse(
			makeFakeCourse({ name: 'course3', studentCourseCode: { code: 'CCCCCC' } })
		)

		const found = await findCourseByCode(COURSE_CODE)
		console.log(found)
		expect(found).toMatchObject({
			course: course2,
		})
	})

	it('rejects when a course is not found', async () => {
		await expect(findCourseByCode('NOT-IN')).rejects.toThrow(
			ReferenceError('Course doc not found.')
		)
	})

	it('rejects when `code` is not provided', async () => {
		await expect(findCourseByCode()).rejects.toThrow(
			ReferenceError('`code` must not be empty.')
		)
	})

	it('rejects when the course is in the system but not published', async () => {
		await addCourse(
			makeFakeCourse({
				isPublished: false,
				studentCourseCode: { code: COURSE_CODE },
			})
		)
		await expect(findCourseByCode(COURSE_CODE)).rejects.toThrow(
			ReferenceError('Course doc not found.')
		)
	})

	it('rejects when the course is in the system but soft deleted', async () => {
		await addCourse(
			makeFakeCourse({
				isDeleted: true,
				studentCourseCode: { code: COURSE_CODE },
			})
		)
		await expect(findCourseByCode(COURSE_CODE)).rejects.toThrow(
			ReferenceError('Course doc not found.')
		)
	})
})
