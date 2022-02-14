module.exports = makeDeleteSection = ({ Section, Course }) => {
	// Delete a section in the db
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteSection(id) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }

			try {
				// Remove section from db
				const section = await Section.findByIdAndDelete(id).exec()
				if (section == null) {
					return reject({ deleted: 0 })
				}

				// Remove section from course.sections
				const course = await Course.findByIdAndUpdate(
					section.courseId,
					{ $pull: { sections: section._id } },
					options
				)

				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
