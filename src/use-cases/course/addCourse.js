module.exports = makeAddCourse = ({ Course }) => {
	// Save a new course doc in the db
	// Resolve -> course Object
	// Rejects -> error
	return async function addCourse(courseInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const course = new Course(courseInfo)
			try {
				const saved = await course.save()
				return resolve(saved.toObject())
			} catch (error) {
				return reject(error)
			}
		})
	}
}
