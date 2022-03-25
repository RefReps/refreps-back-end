module.exports = makeFindCourseForStudent = ({ Course, User }) => {
	// Finds a course for a student and lets the student know if the content is accessible
	// Resolve -> {course: course doc}
	// Reject -> error
	return async function findCourseForStudent(courseId, userId) {
		try {
			// Check for params being used
			if (!courseId) throw new ReferenceError('`courseId` must be provided.')
			if (!userId) throw new ReferenceError('`userId` must be provided.')

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

			const user = await User.findById(userId).exec()

			const course = courseDoc.toObject()

			// Check if user is author or admin and is in course
			let forceShowAll = false
			if (user.role == 'admin') {
				forceShowAll = true
			} else if (user.authorCourses.find((objId) => objId.equals(course._id))) {
				forceShowAll = true
			} else if (
				user.studentCourses.find((objId) => objId.equals(course._id))
			) {
				forceShowAll = false
			} else {
				throw new ReferenceError('`userId` is not related to course')
			}

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
						if (forceShowAll) {
							content.isCompleted = true
							return
						}
						// if (content.isResource) {
						// 	content.isCompleted = true
						// 	return
						// }
						let studentComplete = content.studentsCompleted.find(
							(studentCompleted) => studentCompleted.student.equals(userId)
						)
						if (disableRemainder) {
							content.isCompleted = false
							return
						}
						if (
							studentComplete &&
							studentComplete.percentComplete >=
								course.settings.enforcementPercent
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
