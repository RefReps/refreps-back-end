const { User } = require('../../use-cases/index')

/**
 * Authorizes a student in the course.
 * @param {*} req request: Requires req.email and req.courseId to exist
 * @param {*} res response
 * @param {*} next next middleware
 */
module.exports.authorizeStudentInCourse = async (req, res, next) => {
	try {
		const { email, courseId } = req
		if (!email) {
			throw new Error('req.email not provided.')
		}
		if (!courseId) {
			throw new Error('req.courseId not provided.')
		}
		const user = await User.findUserByEmail(email)
		if (user.studentCourses.includes(courseId)) {
			next()
		} else {
			res.status(401).json({ success: false })
		}
	} catch (error) {
		res
			.status(400)
			.send({ success: false, error: error.name, reason: error.message })
	}
}
