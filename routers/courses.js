const express = require('express')
const router = express.Router()

const multer = require('multer')()

const conn = require('../utils/mongodb/dbConnection')
const coursedb = require('../utils/mongodb/course')
const sectiondb = require('../utils/mongodb/section')
require('dotenv').config({ path: '.env' })

router
	.route('/')
	// Get a list of all accessible courses
	.get((req, res) => {})
	// Post a new course
	.post(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let createdCourse = await coursedb.addNewCourse(req.body)
			res.status(200).json(createdCourse)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:courseId')
	// Get a course by the courseId
	.get(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let course = await coursedb.getCoursesById([req.params.courseId])
			res.status(200).json(course[0])
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Update a courseId by the courseId
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let updatedCourse = await coursedb.updateCourseById(
				req.params.courseId,
				req.body
			)
			res.status(200).json(updatedCourse)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Delete a course by the courseId
	.delete(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let deleted = await coursedb.deleteCourse(req.params.courseId)
			res.status(200).json(deleted)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:courseId/section')
	// Get the brief section info of all sections in the course
	.get(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let sections = await coursedb.getAllSectionsInCourseBrief(
				req.params.courseId
			)
			res.status(200).json(sections)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:courseId/link/:sectionId')
	// Link a section to a course
	.put(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let updatedCourse = await coursedb.pushSectionIntoCourse(
				req.params.courseId,
				req.params.sectionId
			)
			res.status(200).json(updatedCourse)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

module.exports = router
