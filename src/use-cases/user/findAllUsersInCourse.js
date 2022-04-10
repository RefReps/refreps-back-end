module.exports = makeFindAllUsersInCourse = ({ User }) => {
	// Finds users in a course
	// Resolve -> {found: #, course: {object}}
	// Reject -> error
	return async function findAllUsersInCourse(
		courseId,
		{ includeStudents = true, includeAuthors = true } = {}
	) {
		return new Promise(async (resolve, reject) => {
			try {
				let userDocs = []
				if (includeStudents) {
					let students = await User.find()
						.where('studentCourses')
						.in(courseId)
						.exec()
					students.forEach((student) =>
						userDocs.push({ 
							firstName: student.firstName,
							lastName: student.lastName,
							email: student.email, 
							role: 'student' })
					)
				}

				if (includeAuthors) {
					const authors = await User.find()
						.where('authorCourses')
						.in(courseId)
						.exec()
					authors.forEach((author) =>
						userDocs.push({ 
							firstName: author.firstName,
							lastName: author.lastName,
							email: author.email, 
							role: 'author' })
					)
				}

				return resolve(userDocs)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
