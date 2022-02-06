module.exports = makeRemoveAuthorInCourse = ({ User }) => {
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
				if (!usercourseIdId) {
					throw new ReferenceError('`courseId` is required to update')
				}

				const updated = await User.findByIdAndUpdate(
					userId,
					{ $pull: { authorCourses: courseId } },
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
