const express = require('express')
const router = express.Router()

router.route('/').get((req, res) => {
	res.json({ msg: 'Admin root' })
})

module.exports = router
