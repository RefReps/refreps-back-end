const Course = require('../../database/models/course.model')
const User = require('../../database/models/user.model')

const makeAddCourse = require('./addCourse')
const makeCopyCourse = require('./copyCourse')
const makeDeleteCourse = require('./deleteCourse')
const makeFindAllCourses = require('./findAllCourses')
const makeFindAllCoursesForUser = require('./findAllCoursesForUser')
const makeFindCourseById = require('./findCourseById')
const makeUpdateCourse = require('./updateCourse')

module.exports = {
	addCourse: makeAddCourse({ Course }),
	copyCourse: makeCopyCourse({ Course }),
	deleteCourse: makeDeleteCourse({ Course }),
	findAllCourses: makeFindAllCourses({ Course }),
	findAllCoursesForUser: makeFindAllCoursesForUser({ Course, User }),
	findCourseById: makeFindCourseById({ Course }),
	updateCourse: makeUpdateCourse({ Course }),
}
