module.exports = makeRemoveAuthorInCourse = ({ User, Course }) => {
	// Removes an Author from a course
	// Resolve -> updated user document
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the user are
	// not updated. That is handled inside of the controller that uses this function.
	return async function removeAuthorInCourse(userId, courseId) {
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

				// Remove courseId from user.authorCourses
				const updatedUser = await User.findByIdAndUpdate(
					userId,
					{ $pull: { authorCourses: courseId } },
					options
				).exec()
				// Remove userId from course.authors
				const updatedCourse = await Course.findByIdAndUpdate(
					courseId,
					{ $pull: { authors: userId } },
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
