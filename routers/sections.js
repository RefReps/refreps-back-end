const express = require('express')
const router = express.Router()

router
	.route('/')
	// Get a list of all accessible sections
	.get((req, res) => {
		res.json({ msg: 'Sections index' })
	})
	// Post a new section
	.post((req, res) => {
		res.json({ msg: 'Post a new section' })
	})

router
	.route('/:sectionId')
	// Get a section by the sectionId
	.get((req, res) => {
		res.json({ msg: 'Get a section by sectionId' })
	})
	// Update a section by the sectionId
	.put((req, res) => {
		res.json({ msg: 'Update a section by sectionId' })
	})
	// Delete a section by the sectionId
	.delete((req, res) => {
		res.json({ msg: 'Delete a section by sectionId' })
	})
