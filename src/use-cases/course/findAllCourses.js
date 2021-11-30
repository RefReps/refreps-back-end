const errorHandle = require('../../utils/errorHandle.util')

module.exports = makeFindAllCourses = ({ Course }) => {
	// Finds all courses in the db
	// Options: publishedOnly -> Find only published courses (default: true)
	//          includedDeleted -> Also query soft deleted courses (default: false)
	//          skip -> skip the first 'n' entries of the query (default: 0)
	//          limit -> limit the results in the query (default: 100)
	// Resolve -> {found: #, course: {object}}
	// Reject -> error
	return async function findAllCourses({
		publishedOnly = true,
		includeDeleted = false,
		skip = 0,
		limit = 100,
	} = {}) {
		return new Promise(async (resolve, reject) => {
			try {
				if (skip < 0 || limit <= 0) {
					throw new RangeError('query out of range')
				}

				let query = {}
				if (publishedOnly) {
					query['isPublished'] = true
				}
				if (!includeDeleted) {
					query['isDeleted'] = false
				}

				const courseQuery = Course.find(query)
				if (skip > 0) {
					courseQuery.skip(skip)
				}
				courseQuery.limit(limit)

				courseQuery.sort({ name: 1, _id: 1 })
				const courseDocs = await courseQuery.exec()

				let courseObjects = []
				courseDocs.forEach((doc) => {
					courseObjects.push(doc.toObject())
				})
				return resolve({
					found: courseObjects.length,
					courses: courseObjects,
				})
			} catch (error) {
				return reject(error)
			}
		})
	}
}
