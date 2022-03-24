module.exports = makeMarkCompleteForStudent = ({ Content, User }) => {
	// Marks a content complete for the user
	// Resolve -> {content Object}
	// Reject -> error
	return async function markCompleteForStudent(
		contentId,
		studentId,
		percentCompleted = 0,
		forcePercent = false
	) {
		try {
			if (!contentId) throw new ReferenceError('`contentId` is required.')
			if (!studentId) throw new ReferenceError('`studentId` is required.')

			const contentDoc = await Content.findById(contentId).exec()
			if (contentDoc == null) {
				throw new ReferenceError('Content doc not found.')
			}

			// TODO: Add checking to see if student is in course

			// Check if student has a completed already
			if (studentAlreadyCompleted(contentDoc, studentId)) {
				let idx = contentDoc.studentsCompleted.findIndex((stuComplete) =>
					stuComplete.student.equals(studentId)
				)
				contentDoc.studentsCompleted.splice(idx, 1, {
					student: studentId,
					percentComplete: makePercentCompleted(
						contentDoc.studentsCompleted[idx].percentComplete,
						percentCompleted,
						forcePercent
					),
				})
			} else {
				contentDoc.studentsCompleted.push({
					student: studentId,
					percentComplete: makePercentCompleted(0, percentCompleted, true),
				})
			}

			contentDoc.markModified('studentsCompleted')

			await contentDoc.save()

			return Promise.resolve({ content: contentDoc.toObject() })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

const studentAlreadyCompleted = (contentDoc, studentId) => {
	return contentDoc.studentsCompleted.find((studentCompleted) =>
		studentCompleted.student.equals(studentId)
	)
}

const makePercentCompleted = (oldPercent, newPercent, isForced) => {
	if (isForced) {
		return newPercent
	} else if (newPercent >= oldPercent) {
		return newPercent
	}
	return oldPercent
}
