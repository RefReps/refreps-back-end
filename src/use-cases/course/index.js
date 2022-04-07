const Course = require('../../database/models/course.model')
const User = require('../../database/models/user.model')
const Content = require('../../database/models/content.model')

const makeAddCourse = require('./addCourse')
const makeAddCourseCode = require('./addCourseCode')
const makeCopyCourse = require('./copyCourse')
const makeDeleteCourse = require('./deleteCourse')
const makeFindAllCourses = require('./findAllCourses')
const makeFindAllCoursesForUser = require('./findAllCoursesForUser')
const makeFindCourseByCode = require('./findCourseByCode')
const makeFindCourseById = require('./findCourseById')
const makeFindCourseByQuizId = require('./findCourseByQuizId')
const makeFindCourseForStudent = require('./findCourseForStudent')
const makeUpdateCourse = require('./updateCourse')

module.exports = {
	addCourse: makeAddCourse({ Course }),
	addCourseCode: makeAddCourseCode({ Course }),
	copyCourse: makeCopyCourse({ Course }),
	deleteCourse: makeDeleteCourse({ Course }),
	findAllCourses: makeFindAllCourses({ Course }),
	findAllCoursesForUser: makeFindAllCoursesForUser({ Course, User }),
	findCourseByCode: makeFindCourseByCode({ Course }),
	findCourseById: makeFindCourseById({ Course, User }),
	findCourseByQuizId: makeFindCourseByQuizId({ Course, Content }),
	findCourseForStudent: makeFindCourseForStudent({ Course, User }),
	updateCourse: makeUpdateCourse({ Course }),
}
