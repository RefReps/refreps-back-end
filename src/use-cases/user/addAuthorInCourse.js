module.exports = makeAppendAuthorInCourse = ({ User }) => {
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

				// Remove user from being a student in the course if applicable
				const user = await User.findById(userId)
				if (user.studentCourses.includes(courseId)) {
					await User.findByIdAndUpdate(userId, {
						$pull: { studentCourses: courseId },
					})
				}

				const updated = await User.findByIdAndUpdate(
					userId,
					{ $addToSet: { authorCourses: courseId } },
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
