module.exports = makeFindCourseForStudent = ({ Course, User }) => {
	// Finds a course for a student and lets the student know if the content is accessible
	// Resolve -> {course: course doc}
	// Reject -> error
	return async function findCourseForStudent(courseId, studentId) {
		try {
			console.log(studentId)
			// Check for params being used
			if (!courseId) throw new ReferenceError('`courseId` must be provided.')
			if (!studentId) throw new ReferenceError('`studentId` must be provided.')

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

			// TODO: Check if user is in course
			if (!courseDoc.students.includes(studentId))
				throw new ReferenceError('`studentId` is not in course')

			const course = courseDoc.toObject()

			// Filter out non-published content
			course.sections.forEach((section) => {
				section.modules.forEach((module) => {
					module.contents = module.contents.filter(
						(content) => content.isPublished
					)
				})
			})

			// Append a new field on content -> .isCompleted
			let disableRemainder = false
			course.sections.forEach((section) => {
				section.modules.forEach((module) => {
					module.contents.forEach((content) => {
						// if (content.isResource) {
						// 	content.isCompleted = true
						// 	return
						// }
						if (disableRemainder) {
							content.isCompleted = false
							return
						}
						if (
							content.studentsCompleted
								.map((objId) => objId.toString())
								.includes(studentId.toString())
						) {
							content.isCompleted = true
						} else {
							content.isCompleted = false
							disableRemainder = true
						}
					})
				})
			})

			return Promise.resolve({ course })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
