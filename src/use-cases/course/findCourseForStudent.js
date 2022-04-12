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

			// Check if userId is in the course.authors array
			if (course.authors.find((objId) => objId.equals(userId))) {
				// set course.isAuthor to true
				course.isAuthor = true
			}

			// if course.sections is empty, set course.section to empty array
			if (course.sections.length == 0) {
				course.sections = []
			}

			// Filter out non-published content
			if (!forceShowAll) {
				course.sections.forEach((section) => {
					section.modules.forEach((module) => {
						module.contents = module.contents.filter(
							(content) => content.isPublished
						)
					})
				})
			}

			// Arrange contents in order in place
			course.sections.forEach((section) => {
				section.modules.forEach((module) => {
					module.contents.sort((a, b) => {
						return a.contentOrder - b.contentOrder
					})
				})
			})

			// sort modules in order
			course.sections.forEach((section) => {
				section.modules.sort((a, b) => {
					return a.moduleOrder - b.moduleOrder
				})
			})

			// sort sections in order
			course.sections.sort((a, b) => {
				return a.sectionOrder - b.sectionOrder
			})

			const isEnforcements = course.settings.isEnforcements

			// Append a new field on content -> .isOpen
			let disableRemainder = false
			course.sections.forEach((section) => {
				section.modules.forEach((module) => {
					module.contents.forEach((content) => {
						content.isCompleted = false
						if (forceShowAll) {
							content.isOpen = true
							return
						} else if (!isEnforcements) {
							content.isOpen = true
						} else if (content.isKeepOpen) {
							content.isOpen = true
						} else if (disableRemainder) {
							content.isOpen = false
							return
						}

						// If the content's date is not passed, mark it as not completed
						if (content.dropDate && content.dropDate > Date.now()) {
							content.isOpen = false
							disableRemainder = true
							return
						}

						let studentComplete = content.studentsCompleted.find(
							(studentCompleted) => studentCompleted.student.equals(userId)
						)

						if (
							studentComplete &&
							studentComplete.percentComplete >=
								course.settings.enforcementPercent
						) {
							content.isOpen = true
							content.isCompleted = true

							// If content is on video, check if student has watched the entire video
							if (content.onModel == 'Video') {
								if (studentComplete.percentComplete >= 100) {
									content.isCompleted = true
								} else {
									content.isCompleted = false
								}
							}
							return
						} else {
							// open the content (this is the last content) and mark it as not completed
							content.isOpen = true
							content.isCompleted = false
							disableRemainder = true
							return
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
