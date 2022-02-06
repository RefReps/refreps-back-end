module.exports = makeAppendStudentInCourse = ({ User }) => {
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

				const user = await User.findById(userId)
				if (user.authorCourses.includes(courseId)) {
					throw new Error(
						'User is already an Author in the course. User cannot be demoted to Student in course they are already an Author in.'
					)
				}

				const updated = await User.findByIdAndUpdate(
					userId,
					{ $addToSet: { studentCourses: courseId } },
					options
				).exec()
				if (updated == null) {
					throw ReferenceError('User not found')
				}
				return resolve(updated.toObject())
			} catch (error) {
				return reject(error)
			}
		})
	}
}
