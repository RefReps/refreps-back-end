const Course = require('../../database/models/course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddCourse = require('./addCourse')
const makeDeleteCourse = require('./deleteCourse')

describe('deleteCourse Test Suite', () => {
	const addCourse = makeAddCourse({ Course })
	const deleteCourse = makeDeleteCourse({ Course })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Course.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully soft deletes a course by id', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))

		const deleted = await deleteCourse(course1._id, { softDelete: true })
		expect(deleted).toMatchObject({
			softDeleted: 1,
		})
	})

	it('successfully soft deletes given multiple entries in the db', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))
		const course2 = await addCourse(makeFakeCourse({ name: 'course2' }))
		const course3 = await addCourse(makeFakeCourse({ name: 'course3' }))

		const deleted = await deleteCourse(course2._id)
		expect(deleted).toMatchObject({
			softDeleted: 1,
		})
	})

	it('successfully hard deletes a course by id', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))

		const deleted = await deleteCourse(course1._id, { softDelete: false })
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('successfully hard deletes given multiple entries in the db', async () => {
		const course1 = await addCourse(makeFakeCourse({ name: 'course1' }))
		const course2 = await addCourse(makeFakeCourse({ name: 'course2' }))
		const course3 = await addCourse(makeFakeCourse({ name: 'course3' }))

		const deleted = await deleteCourse(course2._id, { softDelete: false })
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('fails to soft delete a course if it is not in the db', async () => {
		await expect(
			deleteCourse('619bc8c5b0bcf8a50744f2ba', {
				softDelete: true,
			})
		).rejects.toEqual({ softDeleted: 0 })
	})

	it('fails to soft delete a course if a bad id is parsed', async () => {
		await expect(
			deleteCourse('bad id', {
				softDelete: true,
			})
		).rejects.toEqual('CastError')
	})

	it('fails to hard delete a course if it is not in the db', async () => {
		await expect(
			deleteCourse('619bc8c5b0bcf8a50744f2ba', {
				softDelete: false,
			})
		).rejects.toEqual({ deleted: 0 })
	})

	it('fails to hard delete a course if a bad id is parsed', async () => {
		let errorMessage = 'nothing'
		try {
			await deleteCourse('bad id', {
				softDelete: false,
			})
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Cast to ObjectId failed for value "bad id" (type string) at path "_id" for model "Course"'
		)
	})
})
