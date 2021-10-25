const query = require('./query')
const create = require('./create')

module.exports.getAllCourses = async (req, res, next) => {
	try {
		const courses = await query.findAllCourses()
		res.json(
			courses.map((course) => {
				return { _id: course._id, courseName: course.courseName }
			})
		)
	} catch (err) {
		console.log(err)
		return res.status(400).json({ query: 'failed' })
	}
}

module.exports.createTemplateCourse = async (req, res, next) => {
	try {
		const templateCourse = await create.createNewCourse(req.body)
		return res.json(templateCourse)
	} catch (err) {
		console.log(err)
		return res.status(400).json({ creation: 'failed' })
	}
}
