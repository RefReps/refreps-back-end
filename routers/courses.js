const express = require('express')
const router = express.Router()

router.get('/:id', (req, res) => {
	res.json({ msg: `Welcome to course ${req.params.id}` })
})

module.exports = router
