const express = require('express')
const router = express.Router()

const multer = require('multer')()

const conn = require('../utils/mongodb/dbConnection')
const courseware = require('../utils/mongodb/courseMiddleware')
const crudOperations = require('../utils/mongodb/crudOperations')
require('dotenv').config({ path: '.env' })

// COURSE ROOT ROUTES

router
	.route('/')
	// Get a list of all accessible courses
	.get(courseware.getAllCourses)
	// Post a new course
	.post(multer.none(), courseware.addNewCourseBlank)

router
	.route('/:courseId')
	// Get a course by the courseId
	.get(courseware.getOneCourse)
	// Update a courseId by the courseId
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			const updatedDoc = await crudOperations.updateDoc(
				'course',
				req.body,
				req.params.courseId
			)
			res.status(200).send(updatedDoc)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})
	// Delete a course by the courseId
	.delete(courseware.deleteCourseById)

// SECTION ROUTES

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
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			const updatedDoc = await crudOperations.updateDoc(
				'section',
				req.body,
				req.params.courseId,
				req.params.sectionId
			)
			res.status(200).send(updatedDoc)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})
	// Delete a specific section
	.delete(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			const updatedDoc = await crudOperations.deleteNestedDoc(
				'section',
				req.params.courseId,
				req.params.sectionId
			)
			res.status(200).send(updatedDoc)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})

// MODULE ROUTES

router
	.route('/:courseId/section/:sectionId/module')
	// Get all of the modules in a section
	.get(courseware.getAllModules)
	//Post a new module in a section
	.post(multer.none(), courseware.addNewModule)

router
	.route('/:courseId/section/:sectionId/module/:moduleId')
	// Get a specific module in a section
	.get(courseware.getModuleById)
	// Update a module
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			const updatedDoc = await crudOperations.updateDoc(
				'module',
				req.body,
				req.params.courseId,
				req.params.sectionId,
				req.params.moduleId
			)
			res.status(200).send(updatedDoc)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})
	// Delete a module
	.delete(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			const updatedDoc = await crudOperations.deleteNestedDoc(
				'module',
				req.params.courseId,
				req.params.sectionId,
				req.params.moduleId
			)
			res.status(200).send(updatedDoc)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:courseId/section/:sectionId/module/:moduleId/content')
	// Get all of the viewable content in the module
	.get(courseware.getAllContentInModule)
	// Post a new content in the module
	.post(multer.none(), courseware.addNewContent)

router
	.route('/:courseId/section/:sectionId/module/:moduleId/content/:contentId')
	// Get all of the viewable content in the module
	.get(courseware.getContentById)
	// Update a content in the db
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			const updatedDoc = await crudOperations.updateDoc(
				'content',
				req.body,
				req.params.courseId,
				req.params.sectionId,
				req.params.moduleId,
				req.params.contentId
			)
			res.status(200).send(updatedDoc)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})
	// Delete a content in the db
	.delete(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			const updatedDoc = await crudOperations.deleteNestedDoc(
				'content',
				req.params.courseId,
				req.params.sectionId,
				req.params.moduleId,
				req.params.contentId
			)
			res.status(200).send(updatedDoc)
		} catch (error) {
			res.status(400).send(error)
		} finally {
			conn.close()
		}
	})

module.exports = router
