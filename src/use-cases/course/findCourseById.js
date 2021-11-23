const errorHandle = require('../../utils/errorHandle.util')

module.exports = makeFindCourseById = ({ Course }) => {
	// Finds a course by an ObjectId
	// Resolve -> {found: #, course: {object}}
	// Reject -> err.name
	return async function findCourseById(
		id,
		{ publishedOnly = true, includeDeleted = false } = {}
	) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = {}
				if (publishedOnly) {
					query['isPublished'] = true
				}
				if (!includeDeleted) {
					query['isDeleted'] = false
				}

				const courseDoc = await Course.findById(id).where(query).exec()
				if (courseDoc == null) {
					return resolve({ found: 0, course: {} })
				}
				const found = courseDoc.toObject()

				return resolve({ found: 1, course: found })
			} catch (err) {
				return reject(errorHandle(err))
			}
		})
	}
}
