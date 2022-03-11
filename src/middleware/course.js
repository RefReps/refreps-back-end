const { Course, User } = require('../use-cases/index')
const { buildErrorResponse } = require('../utils/responses/index')

// requires req.userId
// requires req.params.courseCode
// puts the userId into the course from the  given code
module.exports.appendStudentOnCourseByCode = async (req, res, next) => {
	try {
		const { userId } = req
		if (!userId) throw new ReferenceError('req.userId must be provided.')

		const { courseCode } = req.params
		if (!courseCode)
			throw new ReferenceError('req.params.courseCode must be provided.')

		const { course } = await Course.findCourseByCode(courseCode)
		const user = await User.findUserById(userId)

		if (user.studentCourses.filter((id) => id.equals(course._id)).length > 0) {
			return res
				.status(200)
				.json(buildErrorResponse(Error('Student already in course.')))
		}
		await User.addStudentInCourse(userId, course._id)

		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}
