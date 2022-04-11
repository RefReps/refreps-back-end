// get students progress on the content from the database
module.exports = makeFindStudentsProgress = ({ Content, Course }) => {
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
							populate: {
								path: 'students',
							},
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
					sectionId: {
						courseId: { students },
					},
				},
			} = content
			const {
				moduleId: {
					sectionId: { courseId: course },
				},
				studentsCompleted,
			} = content

			let allStudents = []

			students.forEach((student) => {
				// find the student in the studentsCompleted array
				const studentCompleted = studentsCompleted.find((studentCompleted) =>
					studentCompleted.student._id.equals(student._id)
				)

				if (studentCompleted) {
					allStudents.push({
						student: {
							firstName: studentCompleted.student.firstName,
							lastName: studentCompleted.student.lastName,
							email: studentCompleted.student.email,
							_id: studentCompleted.student._id,
						},
						percentComplete: studentCompleted.percentComplete || 0,
					})
				} else {
					allStudents.push({
						student: {
							firstName: student.firstName,
							lastName: student.lastName,
							email: student.email,
							_id: student._id,
						},
						percentComplete: 0,
					})
				}
			})

			// depopulate the content
			content.depopulate('moduleId studentsCompleted')
console.log(allStudents)
			return Promise.resolve({
				students: allStudents,
				content: content,
				course: course,
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
