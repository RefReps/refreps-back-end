const express = require('express')
const router = express.Router()

const conn = require('../utils/mongodb/dbConnection')
const moduledb = require('../utils/mongodb/module')
const multer = require('multer')()
require('dotenv').config({ path: '.env' })

router
	.route('/')
	// Get a list of all accessible modules
	.get()
	// Post a new module
	.post(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let createdModule = await moduledb.addNewModule(req.body)
			res.status(200).json(createdModule)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:moduleId')
	// Get a module by the moduleId
	.get(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let module = await moduledb.getModulesById([req.params.moduleId])
			res.status(200).json(module[0])
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Update a module by the moduleId
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let updatedModule = await moduledb.updateModuleById(
				req.params.moduleId,
				req.body
			)
			res.status(200).json(updatedModule)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Delete a module by the moduleId
	.delete(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let deleted = await moduledb.deleteModule(req.params.moduleId)
			res.status(200).json(deleted)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:moduleId/content')
	// Get the brief content info of all contents in the module
	.get(async (req, res) => {})

router
	.route('/:moduleId/link/:contendId')
	// Link a content to a module
	.put(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			let updatedModule = await moduledb.pushContentIntoModule(
				req.params.moduleId,
				req.params.contendId
			)
			res.status(200).json(updatedModule)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

module.exports = router
