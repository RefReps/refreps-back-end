const conn = require('./dbConnection')
const Course = conn.models.Course
const { ObjectId } = require('mongoose').Types

// Query all the courses in the db
module.exports.queryAllCourses = async (options = null) => {
	const pipeline = [{ $match: {} }]
	options = options ? options != null : {}
	return await executeAggregation(pipeline, options)
}

module.exports.queryOneCourseById = async (courseId, options = null) => {
	if (!(typeof courseId === 'string')) throw 'courseId must be a string'

	const pipeline = [{ $match: { _id: ObjectId(courseId) } }]
	options = options ? options != null : {}
	return await executeAggregation(pipeline, options)
}

// Executing the aggregation pipelines
const executeAggregation = async (pipeline, options) => {
	if (!pipeline) throw 'A pipeline must be included'
	if (!options) options = {}
	const doc = new Promise(async (resolve, reject) => {
		try {
			let agg = await Course.aggregate(pipeline, options).exec()
			resolve(agg)
		} catch (err) {
			reject(err)
		}
	})
	return doc
}

// Create a new course in the courses collection. (Reccommended to validate doc prior)
module.exports.createNewCourse = async (doc = {}) => {
	return new Promise(async (resolve, reject) => {
		try {
			let createdCourse = new Course(doc)
			await createdCourse.save()
			resolve(createdCourse)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}
