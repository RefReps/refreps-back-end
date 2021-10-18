const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.json({ connection: 'success', msg: 'Refprep API' })
})

module.exports = router
