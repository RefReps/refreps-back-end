module.exports = makeFindCourseById = ({ Course, User }) => {
	// Finds a course by an ObjectId
	// Resolve -> {found: #, course: {object}}
	// Reject -> error
	return async function findCourseById(
		id,
		{ publishedOnly = true, includeDeleted = false, userEmail = '' } = {}
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

				if (userEmail) {
					const user = await User.findOne({ email: userEmail })
					found.isAuthor = user.authorCourses.includes(id)
				}

				return resolve({ found: 1, course: found })
			} catch (error) {
				return reject(error)
			}
		})
	}
}
