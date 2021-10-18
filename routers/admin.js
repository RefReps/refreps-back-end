const express = require('express')
const session = require('express-session')
const router = express.Router()

router.route('/').get((req, res) => {
	res.json({ msg: 'Admin root' })
})

module.exports = router
