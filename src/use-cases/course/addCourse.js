module.exports = makeAddCourse = ({ Course }) => {
	// Save a new course doc in the db
	// Resolve -> course Object
	// Rejects -> err.name
	return async function addCourse(courseInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const course = new Course(courseInfo)
			try {
				const saved = await course.save()
				resolve(saved.toObject())
			} catch (err) {
				reject(err.name)
			}
		})
	}
}
