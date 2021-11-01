const express = require('express')
const router = express.Router()

const conn = require('../utils/mongodb/dbConnection')
const sectiondb = require('../utils/mongodb/section')
const multer = require('multer')()
require('dotenv').config({ path: '.env' })

router
	.route('/')
	// Get a list of all accessible sections
	.get((req, res) => {
		res.json({ msg: 'Sections index' })
	})
	// Post a new section
	.post(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let createdSection = await sectiondb.addNewSection(req.body)
			res.status(200).json(createdSection)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:sectionId')
	// Get a section by the sectionId
	.get(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let section = await sectiondb.getSectionsById([req.params.sectionId])
			res.status(200).json(section[0])
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Update a section by the sectionId
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let updatedSection = await sectiondb.updateSectionById(
				req.params.sectionId,
				req.body
			)
			res.status(200).json(updatedSection)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Delete a section by the sectionId
	.delete(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let deleted = await sectiondb.deleteSection(req.params.sectionId)
			res.status(200).json(deleted)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:sectionId/module')
	// Get the brief module info of all modules in the section
	.get(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let modules = await sectiondb.getAllModulesInSectionBrief(
				req.params.sectionId
			)
			res.status(200).json(modules)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:sectionId/link/:moduleId')
	// Link a module to a section
	.put(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let updatedSection = await sectiondb.pushModuleIntoSection(
				req.params.sectionId,
				req.params.moduleId
			)
			res.status(200).json(updatedSection)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

module.exports = router
