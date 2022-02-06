const User = require('../../database/models/user.model')
const bcrypt = require('bcryptjs')

const makeAddAuthorInCourse = require('./addAuthorInCourse')
const makeAddStudentInCourse = require('./addStudentInCourse')
const makeAddUser = require('./addUser')
const makeAppendRefreshToken = require('./appendRefreshToken')
const makeCompareRefreshToken = require('./compareRefreshToken')
const makeFindUserByEmail = require('./findUserByEmail')
const makeRemoveAuthorInCourse = require('./removeAuthorInCourse')
const makeRemoveRefreshToken = require('./removeRefreshToken')
const makeRemoveStudentInCourse = require('./removeStudentInCourse')

const addAuthorInCourse = makeAddAuthorInCourse({ User })
const addStudentInCourse = makeAddStudentInCourse({ User })
const addUser = makeAddUser({ User, Encryption: bcrypt })
const appendRefreshToken = makeAppendRefreshToken({ User })
const compareRefreshToken = makeCompareRefreshToken({ User })
const findUserByEmail = makeFindUserByEmail({ User })
const removeAuthorInCourse = makeRemoveAuthorInCourse({ User })
const removeRefreshToken = makeRemoveRefreshToken({ User })
const removeStudentInCourse = makeRemoveStudentInCourse({ User })

module.exports = {
	addAuthorInCourse,
	addStudentInCourse,
	addUser,
	appendRefreshToken,
	compareRefreshToken,
	findUserByEmail,
	removeAuthorInCourse,
	removeRefreshToken,
	removeStudentInCourse,
}
