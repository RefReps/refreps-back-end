// get students progress on the content from the database
module.exports = makeFindStudentsProgress = ({ Content }) => {
	return async function findStudentsProgress(contentId) {
		try {
			// find the content and students completed on the content
			const content = await Content.findOne({ _id: contentId })
				.populate({
					path: 'studentsCompleted',
					populate: {
						path: 'student',
					},
				})
				.populate({
					path: 'moduleId',
					populate: {
						path: 'sectionId',
						populate: {
							path: 'courseId',
						},
					},
				})
				.exec()
			if (!content) {
				throw new Error('Content not found')
			}

			// deconstruct the content
			const {
				moduleId: {
					sectionId: { courseId: course },
				},
				studentsCompleted,
			} = content

			// filter out students that are not in the course
			let students = studentsCompleted.filter((student) => {
				return course.students.find((c) => c._id.equals(student.student._id))
			})

			// filter out unneeded data
			students = students.map((student) => {
				return {
					student: {
						firstName: student.student.firstName,
						lastName: student.student.lastName,
						email: student.student.email,
					},
					percentComplete: student.percentComplete,
				}
			})

			console.log(students)

			return Promise.resolve({ students: students })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
