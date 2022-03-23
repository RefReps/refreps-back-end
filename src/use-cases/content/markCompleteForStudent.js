module.exports = makeMarkCompleteForStudent = ({ Content, User }) => {
	// Marks a content complete for the user
	// Resolve -> {content Object}
	// Reject -> error
	return async function markCompleteForStudent(contentId, studentId) {
		try {
			if (!contentId) throw new ReferenceError('`contentId` is required.')
			if (!studentId) throw new ReferenceError('`studentId` is required.')

			const contentDoc = await Content.findById(contentId).exec()
			if (contentDoc == null) {
				throw new ReferenceError('Content doc not found.')
			}

			// Check if student is in course
			if (studentAlreadyCompleted(contentDoc, studentId))
				return Promise.resolve({ content: contentDoc.toObject() })

			// TODO: Add checking to see if student is in course

			contentDoc.studentsCompleted.push(studentId)
			contentDoc.markModified('studentsCompleted')

			await contentDoc.save()

			return Promise.resolve({ content: contentDoc.toObject() })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

const studentAlreadyCompleted = (contentDoc, studentId) => {
	return contentDoc.studentsCompleted.find((objId) => objId.equals(studentId))
}
