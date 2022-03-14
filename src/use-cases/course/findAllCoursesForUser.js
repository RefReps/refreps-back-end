module.exports = makeFindAllCoursesForUser = ({ Course, User }) => {
	// Finds all courses in the db
	// Options: publishedOnly -> Find only published courses (default: true)
	//          skip -> skip the first 'n' entries of the query (default: 0)
	//          limit -> limit the results in the query (default: 100)
	// Resolve -> {found: #, course: [{_id, name, isTemplate}]}
	// Reject -> error
	return async function findAllCoursesForUser(
		userId,
		{ publishedOnly = true, skip = 0, limit = 100 } = {}
	) {
		return new Promise(async (resolve, reject) => {
			try {
				// Lookup user's courses (both author and student)
				const user = await User.findById(userId)
				const courseAuthorIds = Object.values(user.authorCourses)
				const courseStudentIds = Object.values(user.studentCourses)
				const courseIds = [courseAuthorIds, courseStudentIds].flat()

				if (skip < 0 || limit <= 0) {
					throw new RangeError('query out of range')
				}

				let query = {}
				if (publishedOnly) {
					query['isPublished'] = true
				}

				const courseQuery = Course.find(query)
				courseQuery.where('_id').in(courseIds)
				if (skip > 0) {
					courseQuery.skip(skip)
				}
				courseQuery.limit(limit)

				courseQuery.sort({ name: 1, _id: 1 })
				courseQuery.projection({ _id: 1, name: 1, isTemplate: 1 })
				const courseDocs = await courseQuery.exec()

				let courseObjects = []
				courseDocs.forEach((doc) => {
					docObject = doc.toObject()
					docObject.isAuthor = courseAuthorIds.find((objId) =>
						objId.equals(docObject._id)
					)
						? true
						: false
					console.log(docObject)
					courseObjects.push(docObject)
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
