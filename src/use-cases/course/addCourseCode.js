module.exports = makeAddCourseCode = ({ Course }) => {
	// Overwrites a course code on a course
	// Resolve -> {course: {object}}
	// Reject -> error
	return async function addCourseCode(courseId, code) {
		try {
			if (!courseId) throw new ReferenceError('`courseId` must not be empty.')
			if (!code) throw new ReferenceError('`code` must not be empty.')

			let query = {}
			query['studentCourseCode.code'] = code

			const courseDoc = await Course.findById(courseId)

			// no course doc found
			if (courseDoc == null) {
				throw new ReferenceError('Course doc not found.')
			}

			// make sure course code is not used anywhere else
			const otherCourse = await Course.find()
				.where('studentCourseCode.code')
				.equals(code)
				.exec()
			if (otherCourse.length !== 0) throw Error('`code` is already in use.')

			// modify the course code
			courseDoc.studentCourseCode.code = code
			courseDoc.markModified('studentCourseCode.code')
			await courseDoc.save()

			const found = courseDoc.toObject()

			return Promise.resolve({ course: found })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
