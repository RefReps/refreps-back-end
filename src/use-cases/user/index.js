const User = require('../../database/models/user.model')
const Course = require('../../database/models/course.model')
const bcrypt = require('bcryptjs')

const makeAddAuthorInCourse = require('./addAuthorInCourse')
const makeAddStudentInCourse = require('./addStudentInCourse')
const makeAddUser = require('./addUser')
const makeAppendRefreshToken = require('./appendRefreshToken')
const makeCompareRefreshToken = require('./compareRefreshToken')
const makeFindAllUsersInCourse = require('./findAllUsersInCourse')
const makeFindUserByEmail = require('./findUserByEmail')
const makeFindUserById = require('./findUserById')
const makeIsUserInSystem = require('./isUserInSystem')
const makeRemoveAuthorInCourse = require('./removeAuthorInCourse')
const makeRemoveRefreshToken = require('./removeRefreshToken')
const makeRemoveStudentInCourse = require('./removeStudentInCourse')

const addAuthorInCourse = makeAddAuthorInCourse({ User, Course })
const addStudentInCourse = makeAddStudentInCourse({ User, Course })
const addUser = makeAddUser({ User, Encryption: bcrypt })
const appendRefreshToken = makeAppendRefreshToken({ User })
const compareRefreshToken = makeCompareRefreshToken({ User })
const findAllUsersInCourse = makeFindAllUsersInCourse({ User })
const findUserByEmail = makeFindUserByEmail({ User })
const findUserById = makeFindUserById({ User })
const isUserInSystem = makeIsUserInSystem({ User })
const removeAuthorInCourse = makeRemoveAuthorInCourse({ User, Course })
const removeRefreshToken = makeRemoveRefreshToken({ User })
const removeStudentInCourse = makeRemoveStudentInCourse({ User, Course })

module.exports = {
	addAuthorInCourse,
	addStudentInCourse,
	addUser,
	appendRefreshToken,
	compareRefreshToken,
	findAllUsersInCourse,
	findUserByEmail,
	findUserById,
	isUserInSystem,
	removeAuthorInCourse,
	removeRefreshToken,
	removeStudentInCourse,
}
