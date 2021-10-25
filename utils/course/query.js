const conn = require('../../server/dbConnection')

const executeAggregation = async (pipeline, options) => {
	if (!pipeline) throw 'A pipeline must be included'
	if (!options) options = {}
	const doc = new Promise(async (resolve, reject) => {
		try {
			const agg = await conn.models.Course.aggregate(pipeline, options)
			resolve(agg)
		} catch (err) {
			reject(err)
		}
	})
	return doc
}

module.exports.findAllCourses = async (options = null) => {
	const pipeline = [{ $match: {} }]
	options = options ? options != null : {}
	return await executeAggregation(pipeline, options)
}

module.exports.findOneCourseById = async (courseId, options = null) => {
	if (!courseId) throw 'courseId must be included in query'

	const pipeline = [{ $match: { _id: courseId } }]
	options = options ? options != null : {}
	return await executeAggregation(pipeline, options)
}
