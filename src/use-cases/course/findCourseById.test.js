const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeFindCourseById = require('./findCourseById')

describe('findCourseById Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const findCourseById = makeFindCourseById({ Course })

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

	it('finds the right course given multiple entries', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))
		const course2 = await addCourse(makeFakeCourse({ name: 'course2' }))
		const course3 = await addCourse(makeFakeCourse({ name: 'course3' }))

		const found = await findCourseById(course2._id)
		expect(found).toMatchObject({
			found: 1,
			course: course2,
		})
	})

	it('successfully includes only published courses by default', async () => {
		const course1 = await addCourse(makeFakeCourse({ isPublished: false }))
		const found = await findCourseById(course1._id)
		expect(found).toMatchObject({ found: 0, course: {} })
	})

	it('successfully includes not published courses when requested', async () => {
		const course1 = await addCourse(makeFakeCourse({ isPublished: false }))
		const found = await findCourseById(course1._id, { publishedOnly: false })
		expect(found).toMatchObject({ found: 1, course: course1 })
	})

	it('successfully excludes soft deleted courses by default', async () => {
		const course1 = await addCourse(makeFakeCourse({ isDeleted: true }))
		const found = await findCourseById(course1._id)
		expect(found).toMatchObject({ found: 0, course: {} })
	})

	it('successfully inlcudes soft deleted courses when requested', async () => {
		const course1 = await addCourse(makeFakeCourse({ isDeleted: true }))
		const found = await findCourseById(course1._id, { includeDeleted: true })
		expect(found).toMatchObject({ found: 1, course: course1 })
	})

	it('successfully finds only if the course is in the db', async () => {
		await expect(
			findCourseById('6197ae39ef8716d0dd181e08')
		).resolves.toMatchObject({ found: 0, course: {} })
	})

	it('CastError when the id is not an ObjectId', async () => {
		await expect(findCourseById('123')).rejects.toEqual(
			'Error - Type: CastError'
		)
	})
})
