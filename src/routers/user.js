// express router
const express = require('express')
const router = express.Router()

// middleware
const multer = require('multer')
const {
	isAuthenticated,
	authorizeAdmin,
	bindUserIdFromEmail,
} = require('../utils/middleware/index')

// use cases
const useCases = require('../use-cases')
const { User } = useCases

// routes
router.get('/', isAuthenticated, authorizeAdmin, async (req, res) => {
	try {
		const { users } = await User.getAll()
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// export router
module.exports = router
