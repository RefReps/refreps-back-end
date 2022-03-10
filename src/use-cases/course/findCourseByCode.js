module.exports = makeFindCourseByCode = ({ Course }) => {
	// Finds a course by an ObjectId
	// Resolve -> {course: {object}}
	// Reject -> error
	return async function findCourseByCode(code) {
		try {
			if (!code) throw new ReferenceError('`code` must not be empty.')

			let query = {}
			query['isPublished'] = true
			query['isDeleted'] = false
			query['studentCourseCode.code'] = code

			const courseDoc = await Course.findOne().where(query).exec()

			// no course doc found
			if (courseDoc == null) {
				throw new ReferenceError('Course doc not found.')
			}

			const found = courseDoc.toObject()

			return Promise.resolve({ course: found })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
