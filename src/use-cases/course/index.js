const Course = require('../../database/models/course.model')

const makeAddCourse = require('./addCourse')
const makeDeleteCourse = require('./deleteCourse')
const makeFindAllCourses = require('./findAllCourses')
const makeFindCourseById = require('./findCourseById')
const makeUpdateCourse = require('./updateCourse')

module.exports = {
	addCourse: makeAddCourse({ Course }),
	deleteCourse: makeDeleteCourse({ Course }),
	findAllCourses: makeFindAllCourses({ Course }),
	findCourseById: makeFindCourseById({ Course }),
	updateCourse: makeUpdateCourse({ Course }),
}
