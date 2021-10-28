const express = require('express')
const router = express.Router()

router
	.route('/')
	// Get a list of all accessible contents
	.get((req, res) => {
		res.json({ msg: 'Contents index' })
	})
	// Post a new content
	.post((req, res) => {
		res.json({ msg: 'Post a new content' })
	})

router
	.route('/:contentId')
	// Get a content by the contentId
	.get((req, res) => {
		res.json({ msg: 'Get a content by contentId' })
	})
	// Update a content by the contentId
	.put((req, res) => {
		res.json({ msg: 'Update a content by contentId' })
	})
	// Delete a content by the contentId
	.delete((req, res) => {
		res.json({ msg: 'Delete a content by contentId' })
	})
