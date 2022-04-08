module.exports = makeDeleteSection = ({ Section, Course, Module, Content }) => {
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

				// Get all modules on the section
				const modules = await Module.find({ sectionId: section._id }).exec()

				// Delete all modules on the section
				await Module.deleteMany({ _id: { $in: modules.map(m => m._id) } }).exec()

				// Delete all contents on the modules
				await Content.deleteMany({
					moduleId: { $in: modules.map(module => module._id) },
				}).exec()

				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
