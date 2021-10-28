const express = require('express')
const router = express.Router()

router
	.route('/')
	// Get a list of all accessible modules
	.get((req, res) => {
		res.json({ msg: 'Moudles index' })
	})
	// Post a new module
	.post((req, res) => {
		res.json({ msg: 'Post a new module' })
	})

router
	.route('/:moduleId')
	// Get a module by the moduleId
	.get((req, res) => {
		res.json({ msg: 'Get a module by moduleId' })
	})
	// Update a module by the moduleId
	.put((req, res) => {
		res.json({ msg: 'Update a module by moduleId' })
	})
	// Delete a module by the moduleId
	.delete((req, res) => {
		res.json({ msg: 'Delete a module by moduleId' })
	})
