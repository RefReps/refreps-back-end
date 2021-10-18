const express = require('express')
const router = express.Router()

router.route('/new').post((req, res) => {
	res.json({ msg: 'Making a new course' })
})

router.route('/:id').get((req, res) => {
	if (isNaN(req.params.id)) {
		res.json({ msg: 'Could not find course' })
	}
	res.json({ msg: `Welcome to course ${req.params.id}` })
})

router.route('/').get((req, res) => {
	res.json({ msg: 'course index' })
})

module.exports = router
