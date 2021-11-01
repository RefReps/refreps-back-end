const coursedb = require('./course')
const conn = require('./dbConnection')
require('dotenv').config({ path: '.env' })

const db_uri = process.env.DB_CONNECT

// MIDDLEWARE THAT DEALS WITH THE COURSE ROOT

// Get a list of all courses
module.exports.getAllCourses = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let courses = await coursedb.getAllCourses()
		res.status(200).json(courses)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

// Add a new course from a blank template
module.exports.addNewCourseBlank = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let course = await coursedb.addNewCourse(req.body)
		res.status(200).json(course)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

// Delete a course from the db
module.exports.deleteCourseById = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let course = await coursedb.deleteCourseById(req.params.courseId)
		res.status(200).json(course)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

// MIDDLEWARE THAT DEALS WITH SECTIONS

module.exports.addNewSection = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let course = await coursedb.pushNewSectionBlank(
			req.params.courseId,
			req.body
		)
		res.status(200).json(course)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

module.exports.deleteSection = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let course = await coursedb.deleteSection(
			req.params.courseId,
			req.params.sectionId
		)
		res.status(200).json(course)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

module.exports.getSectionById = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let section = await coursedb.getOneSection(
			req.params.courseId,
			req.params.sectionId
		)
		res.status(200).json(section)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

module.exports.getAllSectionsInCourse = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let sections = await coursedb.getAllSections(req.params.courseId)
		res.status(200).json(sections)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

// MODULE MIDDLEWARE

module.exports.addNewModule = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		const { courseId, sectionId } = req.params
		let course = await coursedb.pushNewModule(courseId, sectionId, req.body)
		res.status(200).json(course)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}

module.exports.updateModule = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		const { courseId, sectionId, moduleId } = req.params
		let sections = await coursedb.updateModule(
			courseId,
			sectionId,
			moduleId,
			req.body
		)
		res.status(200).json(sections)
	} catch (error) {
		res.status(400).json(error)
	} finally {
		conn.close()
		next()
	}
}
