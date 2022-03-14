module.exports = makeAppendAuthorInCourse = ({ User, Course }) => {
	// Appends the course in the list of courses that the User will be an Author of
	// Resolve -> updated user document
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the user are
	// not updated. That is handled inside of the controller that uses this function.
	return async function appendAuthorInCourse(userId, courseId) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				if (!userId) {
					throw new ReferenceError('`userId` is required to update')
				}
				if (!courseId) {
					throw new ReferenceError('`courseId` is required to update')
				}
				if (typeof courseId != 'string') {
					try {
						courseId = courseId.toString()
					} catch (error) {
						throw error
					}
				}

				// Find user and course by id
				const user = await User.findById(userId)
				const course = await Course.findById(courseId)

				if (user == null) {
					throw ReferenceError('User not found.')
				}
				if (course == null) {
					throw ReferenceError('Course not found.')
				}

				// Remove user from being a student in the user.studentCourses if applicable
				if (user.studentCourses.includes(courseId)) {
					await User.findByIdAndUpdate(userId, {
						$pull: { studentCourses: courseId },
					})
				}
				// Remove user from being a student in the course.students if applicable
				if (course.students.includes(userId)) {
					await Course.findByIdAndUpdate(courseId, {
						$pull: { students: userId },
					})
				}

				// Add user to being an author in user.authorCourses
				const updatedUser = await User.findByIdAndUpdate(
					userId,
					{ $addToSet: { authorCourses: courseId } },
					options
				).exec()
				// Add user to being an author in course.authors
				const updatedCourse = await Course.findByIdAndUpdate(
					courseId,
					{ $addToSet: { authors: userId } },
					options
				).exec()

				return resolve({
					user: updatedUser.toObject(),
					course: updatedCourse.toObject(),
				})
			} catch (error) {
				return reject(error)
			}
		})
	}
}
