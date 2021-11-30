module.exports = makeDeleteCourse = ({ Course }) => {
	// Delete a course in the db
	// Resolve -> course Object
	// Rejects -> error
	return async function deleteCourse(id, { softDelete = true } = {}) {
		return new Promise(async (resolve, reject) => {
			if (softDelete) {
				try {
					const course = await Course.findByIdAndUpdate(id, {
						isDeleted: true,
					}).exec()
					if (course == null) {
						return reject({ softDeleted: 0 })
					}
					return resolve({ softDeleted: 1 })
				} catch (err) {
					return reject(err.name)
				}
			} else {
				try {
					const course = await Course.findByIdAndDelete(id).exec()
					if (course == null) {
						return reject({ deleted: 0 })
					}
					return resolve({ deleted: 1 })
				} catch (error) {
					return reject(error)
				}
			}
		})
	}
}
