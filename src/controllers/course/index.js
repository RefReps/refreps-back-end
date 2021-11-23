const { course } = require('../../use-cases/index')

const makePostCourse = require('./post-course')

module.exports = Object.freeze({
	postCourse: makePostCourse({ addCourse: course.addCourse }),
})
