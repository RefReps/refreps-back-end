const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeFindAllCourses = require('./findAllCourses')

describe('findAllCourses Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const findAllCourses = makeFindAllCourses({ Course })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Course.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds all courses', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))
		const course2 = await addCourse(makeFakeCourse({ name: 'course2' }))

		const foundCourses = await findAllCourses()
		expect(foundCourses.found).toBe(2)
		expect(foundCourses.courses).toEqual([course1, course2])
	})

	it('skips the first n courses in the search', async () => {
		for (let i = 1; i <= 10; i++) {
			await addCourse(makeFakeCourse({ name: `course_${i}` }))
		}

		const results = await findAllCourses({ skip: 2 })
		expect(results.found).toBe(8)
	})

	it('limits the amount of courses in the search', async () => {
		for (let i = 1; i <= 10; i++) {
			await addCourse(makeFakeCourse({ name: `course_${i}` }))
		}

		const results = await findAllCourses({ limit: 4 })
		expect(results.found).toBe(4)
	})

	it('returns found of 0 if no courses are found', async () => {
		const results = await findAllCourses()
		expect(results).toMatchObject({ found: 0, courses: [] })
	})

	it('rejects with `RangeError` if invalid param', async () => {
		let errorMessage = 'nothing'
		try {
			await findAllCourses({ limit: -1 })
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe('query out of range')
	})

	it('includes non published courses if specified', async () => {
		await addCourse(makeFakeCourse({ isPublished: false }))
		await addCourse(makeFakeCourse({ isPublished: true }))

		const resultsPublishedOnly = await findAllCourses({ publishedOnly: true })
		expect(resultsPublishedOnly.found).toBe(1)

		const resultsNonPublished = await findAllCourses({ publishedOnly: false })
		expect(resultsNonPublished.found).toBe(2)
	})

	it('successfully inlcudes soft deleted courses when requested', async () => {
		await addCourse(makeFakeCourse({ isDeleted: true }))
		const results = await findAllCourses({ includeDeleted: true })
		expect(results.found).toBe(1)
	})
})
