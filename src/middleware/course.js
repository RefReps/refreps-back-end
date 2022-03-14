const { Course, User } = require('../use-cases/index')
const { buildErrorResponse } = require('../utils/responses/index')
const { request, response } = require('express')

/**
 * puts the userId into the course from the  given code
 * @param {request} req - requires req.userId, req.params.courseCode
 * @param {response} res
 * @param {next} next
 * @returns
 */
module.exports.appendStudentOnCourseByCode = async (req, res, next) => {
	try {
		const { userId } = req
		if (!userId) throw new ReferenceError('req.userId must be provided.')

		const { courseCode } = req.params
		if (!courseCode)
			throw new ReferenceError('req.params.courseCode must be provided.')

		const { course } = await Course.findCourseByCode(courseCode)
		const user = await User.findUserById(userId)

		// Check if student is already in course
		if (user.studentCourses.filter((id) => id.equals(course._id)).length > 0) {
			return res
				.status(200)
				.json(buildErrorResponse(Error('Student already in course.')))
		}

		// Check if course is full
		if (course.students.length >= course.settings.courseCapacity) {
			return res.status(200).json(buildErrorResponse(Error('Course is full.')))
		}

		// Append user
		await User.addStudentInCourse(userId, course._id)

		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}

/**
 *
 * @param {request} req - requires req.body = {courseEnforcemnts, enforcementPercent, maxQuizAttempts, couponLocked}, req.params.courseId
 * @param {response} res
 * @param {next} next
 */
module.exports.updateCourseSettingsAuthor = async (req, res, next) => {
	try {
		const { courseId } = req.params
		const {
			courseEnforcements,
			enforcementPercent,
			maxQuizAttempts,
			couponLocked,
		} = req.body

		if (!courseId) {
			throw new ReferenceError('`req.params.courseId` is required')
		}
		if (
			checkUndefinedInArray([
				courseEnforcements,
				enforcementPercent,
				maxQuizAttempts,
				couponLocked,
			])
		) {
			throw new ReferenceError('req.body is required')
		}

		const { course } = await Course.findCourseById(courseId)
		const payload = {}
		payload.settings = Object.assign({}, course.settings, {
			isEnforcements: courseEnforcements,
			enforcementPercent: enforcementPercent,
			maximumQuizAttempts: maxQuizAttempts,
		})
		payload.studentCourseCode = Object.assign({}, course.studentCourseCode, {
			isLocked: couponLocked,
		})
		await Course.updateCourse(courseId, payload)

		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}

/**
 *
 * @param {request} req - requires req.body = {studentCapacity, couponCodeName, couponCodeExpDate}, req.params.courseId
 * @param {response} res
 * @param {next} next
 */
module.exports.updateCourseSettingsAdmin = async (req, res, next) => {
	try {
		const { courseId } = req.params
		const { studentCapacity, couponCodeName, couponCodeExpDate } = req.body

		if (!courseId) {
			throw new ReferenceError('`req.params.courseId` is required')
		}
		if (
			checkUndefinedInArray([
				studentCapacity,
				couponCodeName,
				couponCodeExpDate,
			])
		) {
			throw new ReferenceError('req.body is required')
		}

		let courseWithCodeAlready
		try {
			const { course: courseWithSameCode } = await Course.findCourseByCode(
				couponCodeName
			)
			courseWithCodeAlready = courseWithSameCode
		} catch (error) {}

		const { course } = await Course.findCourseById(courseId)

		// Check if there is another course with the same coupon name
		if (courseWithCodeAlready) {
			// Check if the coupon is empty (allowed). Check if the the courses have different id's
			if (
				couponCodeName !== '' &&
				!courseWithCodeAlready._id.equals(course._id)
			) {
				throw new Error('Course Code already exists.')
			}
		}

		const payload = {}
		payload.settings = Object.assign({}, course.settings, {
			courseCapacity: studentCapacity,
		})
		payload.studentCourseCode = Object.assign({}, course.studentCourseCode, {
			code: couponCodeName,
			activeUntil: couponCodeExpDate,
		})
		await Course.updateCourse(courseId, payload)

		next()
	} catch (error) {
		return res.status(200).json(buildErrorResponse(error))
	}
}

const checkUndefinedInArray = (lst = []) => {
	return lst.filter((ele) => ele === undefined).length > 0
}
