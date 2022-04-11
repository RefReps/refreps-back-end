module.exports = makeGetCourseSkeleton = ({ Course }) => {
	// Gets the skeleton of a course
	// Resolve -> {course: course doc}
	// Reject -> error
	return async function getCourseSkeleton(courseId) {
		try {
			// Check for params being used
			if (!courseId) throw new ReferenceError('`courseId` must be provided.')

			// Find course doc based on courseId
			const courseDoc = await Course.findById(courseId)
				.populate({
					path: 'sections',
					populate: {
						path: 'modules',
						populate: {
							path: 'contents',
						},
					},
				})
				.exec()
			if (courseDoc == null) {
				throw new ReferenceError('No course doc found.')
			}

			const course = courseDoc.toObject()

			return Promise.resolve({ course })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}