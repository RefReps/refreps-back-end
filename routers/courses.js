const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongoose').Types

// Server db Import
const conn = require('./../server/dbConnection')

// Import Middleware
const verifyToken = require('../utils/middleware/verifyToken')
const verifyUser = require('../utils/middleware/verifyUser')
const verification = require('../utils/validation')
const upload = require('../utils/middleware/server-upload')
const uploadS3 = require('../utils/middleware/s3-upload')

// Set default Middleware for path

// Display all accessable courses that the user has access to
router.route('/').get(async (req, res) => {
	try {
		const courses = await conn.models.Course.find().exec()
		res.json(
			courses.map((course) => {
				return { _id: course._id, courseName: course.courseName }
			})
		)
	} catch (err) {
		console.log(err)
		res.status(400).json({ query: 'failed' })
	}
})

// Make a new course (admin only)
router.route('/new').post(async (req, res) => {
	try {
		const course = new conn.models.Course({
			courseName: req.query.name ? req.query.name : 'Course Not Named',
			isTemplateCourse: true ? req.query.isTemplate == 'true' : false,
			sections: [{}, {}],
			authors: [],
			students: [],
			settings: {},
		})
		course.save()
		res.status(201).json(course)
	} catch (err) {
		console.log(err)
		res.status(400).json({ post: 'failed' })
	}
})

// Go to a specific course's home page (if access to do so)
router.route('/:courseId').get(async (req, res) => {
	if (!req.params.courseId) {
		res.status(400).json({ msg: 'Could not find course' })
	}
	try {
		const course = await conn.models.Course.findById(req.params.courseId).exec()
		if (course) {
			return res.json(course)
		}
	} catch (err) {
		console.log(err)
		return res.status(400).json({ query: 'failed' })
	}
	res.status(204).json({
		query: 'success',
		msg: `Could not find course with id: ${req.params.courseId}`,
	})
})

// Get all the sections for a course
router.route('/:courseId/section').get(async (req, res) => {
	if (!req.params.courseId) {
		res.status(400).json({ msg: 'Could not find course' })
	}
	try {
		const course = await conn.models.Course.aggregate([
			{ $match: { _id: ObjectId(req.params.courseId) } },
			{ $project: { _id: 0, sections: 1 } },
		]).exec()
		if (course) {
			return res.json(course[0].sections)
		}
	} catch (err) {
		console.log(err)
		return res.status(400).json({ query: 'failed' })
	}
	res.status(204).json({
		query: 'success',
		msg: `Could not find course with id: ${req.params.courseId}`,
	})
})

// Create a new section and append it to the end of the sections for the course
router.route('/:courseId/section/new').post((req, res) => {})

router
	.route('/:courseId/section/:sectionId')
	// Get content for a specific section, such as all of the modules in the section
	.get((req, res) => {})
	// Update section ordering
	.put((req, res) => {})
	// Delete a specific section from the course
	.delete((req, res) => {})

router
	.route('/:courseId/section/:sectionId/module/:moduleId')
	// Get a specific module within a course's section
	.get((req, res) => {})

router
	.route('/:courseId/section/:sectionId/module/:moduleId/:contentType')
	// Append a new Content doc to the module
	.post((req, res) => {})

router
	.route('/:courseId/section/:sectionId/module/:moduleId/:contentId')
	.get((req, res) => {})

module.exports = router
