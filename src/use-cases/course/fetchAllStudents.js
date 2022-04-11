// fetch all students in the course from the database
module.exports = makeFetchAllStudents = ({ Course }) => {
	return async function fetchAllStudents(courseId) {
		try {
			let course = await Course.findById(courseId).populate('students').exec()
			let students = course.students.toObject()
			students = students.map((student) => {
				return {
					firstName: student.firstName,
					lastName: student.lastName,
					email: student.email,
					role: 'student',
				}
			})
			return Promise.resolve({ students: students })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
