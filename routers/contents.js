const express = require('express')
const router = express.Router()

const conn = require('../utils/mongodb/dbConnection')
const contentdb = require('../utils/mongodb/content')
const multer = require('multer')()
require('dotenv').config({ path: '.env' })

router
	.route('/')
	// Get a list of all accessible contents
	.get((req, res) => {})
	// Post a new content
	.post(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			console.log(req.body)
			let createdContent = await contentdb.addNewContent(req.body)
			res.status(200).json(createdContent)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

router
	.route('/:contentId')
	// Get a content by the contentId
	.get(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			console.log(req.body)
			let content = await contentdb.getContentsById([req.params.contentId])
			res.status(200).json(content[0])
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Update a content by the contentId
	.put(multer.none(), async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			console.log(req.body)
			let updatedContent = await contentdb.updateContentById(req.body)
			res.status(200).json(updatedContent)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})
	// Delete a content by the contentId
	.delete(async (req, res) => {
		try {
			await conn.openUri(process.env.DB_CONNECT)
			console.log(req.body)
			let deleted = await contentdb.deleteContent(req.params.contentId)
			res.status(200).json(deleted)
		} catch (error) {
			res.status(400).json(error)
		} finally {
			conn.close()
		}
	})

module.exports = router
