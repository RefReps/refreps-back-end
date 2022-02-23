module.exports = makeAddSection = ({ Section, Course }) => {
	// Save a new section in the db
	// Resolve -> section object
	// Reject -> error name
	return async function addSection(sectionInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }

			const section = new Section(sectionInfo)
			try {
				// Add section to course.sections
				const course = await Course.findByIdAndUpdate(
					sectionInfo.courseId,
					{
						$push: { sections: section._id },
					},
					options
				)
				// if (course == null) {
				// 	throw ReferenceError('Course not found.')
				// }

				const saved = await section.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
