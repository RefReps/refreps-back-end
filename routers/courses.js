const express = require('express')
const router = express.Router()

const multer = require('multer')()

const conn = require('../utils/mongodb/dbConnection')
const courseware = require('../utils/mongodb/courseMiddleware')
require('dotenv').config({ path: '.env' })

router
	.route('/')
	// Get a list of all accessible courses
	.get(courseware.getAllCourses)
	// Post a new course
	.post(multer.none(), courseware.addNewCourseBlank)

router
	.route('/:courseId')
	// Get a course by the courseId
	.get(async (req, res) => {})
	// Update a courseId by the courseId
	.put(multer.none(), async (req, res) => {})
	// Delete a course by the courseId
	.delete(courseware.deleteCourseById)

router
	.route('/:courseId/section')
	// Get the brief section info of all sections in the course
	.get(courseware.getAllSectionsInCourse)
	// Post a new section in the course
	.post(multer.none(), courseware.addNewSection)

router
	.route('/:courseId/section/:sectionId')
	// Get a specific section
	.get(courseware.getSectionById)
	// Update a specifc section
	.put(multer.none(), async (req, res) => {})
	// Delete a specific section
	.delete(courseware.deleteSection)

router
	.route('/:courseId/section/:sectionId/module')
	// Get all of the modules in a section
	.get()
	//Post a new module in a section
	.post(multer.none(), courseware.addNewModule)

router
	.route('/:courseId/section/:sectionId/module/:moduleId')
	// Get a specific module in a section
	.get()
	// Update a module
	.put()
	// Delete a module
	.delete()

module.exports = router
