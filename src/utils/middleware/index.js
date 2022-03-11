const { isAuthenticated } = require('./auth')
const { bindUserIdFromEmail } = require('./bindUserIdFromEmail')
const { authorizeStudentInCourse } = require('./courseAuth')
const { authorizeAdmin } = require('./userRole')

module.exports = {
	isAuthenticated,
	bindUserIdFromEmail,
	authorizeStudentInCourse,
	authorizeAdmin,
}
