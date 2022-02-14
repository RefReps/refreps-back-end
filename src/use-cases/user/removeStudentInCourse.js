module.exports = makeRemoveStudentInCourse = ({ User, Course }) => {
	// Removes an Student from a course
	// Resolve -> updated user document
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the user are
	// not updated. That is handled inside of the controller that uses this function.
	return async function removeStudentInCourse(userId, courseId) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				if (!userId) {
					throw new ReferenceError('`id` is required to update')
				}
				if (!courseId) {
					throw new ReferenceError('`courseId` is required to update')
				}

				const user = await User.findById(userId)
				const course = await Course.findById(courseId)

				if (user == null) {
					throw ReferenceError('User not found.')
				}
				if (course == null) {
					throw ReferenceError('Course not found.')
				}

				// Remove courseId from user.studentCourses
				const updatedUser = await User.findByIdAndUpdate(
					userId,
					{ $pull: { studentCourses: courseId } },
					options
				).exec()
				// Remove userId from course.students
				const updatedCourse = await Course.findByIdAndUpdate(
					courseId,
					{ $pull: { students: userId } },
					options
				)

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
