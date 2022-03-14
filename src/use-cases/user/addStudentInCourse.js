module.exports = makeAppendStudentInCourse = ({ User, Course }) => {
	// Appends the course in the list of courses that the User will be a Student of
	// Resolve -> updated user document
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the user are
	// not updated. That is handled inside of the controller that uses this function.
	return async function appendStudentInCourse(userId, courseId) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				if (!userId) {
					throw new ReferenceError('`userId` is required to update')
				}
				if (!courseId) {
					throw new ReferenceError('`courseId` is required to update')
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

				// Throw error if author is trying to be added as a student
				if (
					user.authorCourses.includes(courseId) ||
					course.authors.includes(userId)
				) {
					throw new Error(
						'User is already an Author in the course. User cannot be demoted to Student in course they are already an Author in.'
					)
				}

				// Add courseId to user.studentCourses
				const updatedUser = await User.findByIdAndUpdate(
					userId,
					{ $addToSet: { studentCourses: courseId } },
					options
				).exec()
				// Add userId to course.students
				const updatedCourse = await Course.findByIdAndUpdate(
					courseId,
					{ $addToSet: { students: userId } },
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
