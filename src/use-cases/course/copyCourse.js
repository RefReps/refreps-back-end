module.exports = makeCopyCourse = ({ Course }) => {
	// Copy a course
	// Resolve -> course object
	// Reject -> error name
	return async function copyCourse(courseId, overrides = {}) {
		return new Promise(async (resolve, reject) => {
			try {
				const course = await Course.findById(courseId)

				if (!course) {
					throw ReferenceError('Not Found')
				}

				const courseInfo = {
					name: course.name + ' (copy)',
					isTemplate: course.isTemplate,
					isPublished: course.isPublished,
					isDeleted: course.isDeleted,
					settings: course.settings,
				}

				const copyCourse = new Course({ ...courseInfo, ...overrides })

				const saved = await copyCourse.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
