module.exports = makeUpdateCourse = ({ Course }) => {
	// Updates an existing course
	// Resolve -> {count: #, course: {courseObject}}
	// Rejects -> err.name

	// NOTE: this function does not ensure any specific parts of the course are
	// not updated. That is handled inside of the controller that uses this function.
	return async function updateCourse(id, courseInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				const updated = await Course.findByIdAndUpdate(
					id,
					courseInfo,
					options
				).exec()
				if (updated == null) {
					resolve({ count: 0, course: {} })
				}
				return resolve({ count: 1, course: updated.toObject() })
			} catch (err) {
				return reject(err.name)
			}
		})
	}
}
