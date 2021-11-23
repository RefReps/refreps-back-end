const Course = require('./course.model')
const { makeFakeCourse } = require('../../../__test__/fixtures')
const {
	validateNotEmpty,
	validateStringEquality,
	validateBooleanEquality,
	validateNumberEquality,
	validateMongoDuplicationError,
	validateMongoValidationError,
} = require('../../utils/test-utils/validators.utils')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')

beforeAll(async () => await dbConnect())
afterAll(async () => await dbDisconnect())

describe('Course Model Test Suite', () => {
	it('should validate saving a new course successfully', async () => {
		const fakeCourse = makeFakeCourse()
		const validCourse = new Course(fakeCourse)
		const savedCourse = await validCourse.save()

		validateNotEmpty(savedCourse)

		validateStringEquality(savedCourse.name, fakeCourse.name)
		validateBooleanEquality(savedCourse.isTemplate, fakeCourse.isTemplate)
		validateBooleanEquality(savedCourse.isPublished, fakeCourse.isPublished)

		validateBooleanEquality(
			savedCourse.settings.isEnforcements,
			fakeCourse.settings.isEnforcements
		)
		validateNumberEquality(
			savedCourse.settings.enforcementPercent,
			fakeCourse.settings.enforcementPercent
		)
		validateBooleanEquality(
			savedCourse.settings.isGradedQuizAdvance,
			fakeCourse.settings.isGradedQuizAdvance
		)
		validateNumberEquality(
			savedCourse.settings.maximumQuizAttempts,
			fakeCourse.settings.maximumQuizAttempts
		)
	})

	it('should validate a course name too short', async () => {
		const fakeCourse = makeFakeCourse()
		const invalidCourse = new Course(fakeCourse)
		invalidCourse.set('name', 'short')
		try {
			await invalidCourse.validate()
			fail('Course should be invalid')
		} catch (error) {
			const { name } = error
			validateMongoValidationError(name)
		}
	})

	it('should validate a course name too long', async () => {
		const fakeCourse = makeFakeCourse()
		const invalidCourse = new Course(fakeCourse)
		let longString = ''
		for (let i = 0; i < 255; i++) {
			longString += 'a'
		}
		invalidCourse.set('name', longString)
		try {
			await invalidCourse.validate()
			fail('should not reach here')
		} catch (error) {
			const { name } = error
			validateMongoValidationError(name)
		}
	})

	it('should validate enofrocementPercent to low', async () => {
		const fakeCourse = makeFakeCourse()
		const invalidCourse = new Course(fakeCourse)
		invalidCourse.set('settings.enforcementPercent', -2)
		try {
			await invalidCourse.validate()
			fail('should not reach here')
		} catch (error) {
			const { name } = error
			validateMongoValidationError(name)
		}
	})

	it('should validate enofrocementPercent to high', async () => {
		const fakeCourse = makeFakeCourse()
		const invalidCourse = new Course(fakeCourse)
		invalidCourse.set('settings.enforcementPercent', 101)
		try {
			await invalidCourse.validate()
			fail('should not reach here')
		} catch (error) {
			const { name } = error
			validateMongoValidationError(name)
		}
	})

	// it('should validate MongoError duplicate error with code 11000', async () => {
	// 	expect.assertions(0)
	// 	const validCourse = new Course(fakeCourseData)

	// 	try {
	// 		await validCourse.save()
	// 	} catch (error) {
	// 		const { name, code } = error
	// 		validateMongoDuplicationError(name, code)
	// 	}
	// })
})
