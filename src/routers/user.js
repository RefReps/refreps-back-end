// express router
const express = require('express')
const router = express.Router()

// middleware
const multer = require('multer')()
const {
	isAuthenticated,
	authorizeAdmin,
	bindUserIdFromEmail,
} = require('../utils/middleware/index')

// use cases
const useCases = require('../use-cases')
const { User } = useCases

// router middleware
router.use(isAuthenticated)

// routes

router
	// @route   GET api/user/
	// @desc    Get all users
	// @access  Authenticated, Admin
	.get('/', authorizeAdmin, async (req, res) => {
		try {
			const { users } = await User.getAll()
			res.status(200).json({ users: users })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

router
	// @route   GET api/user/:id
	// @desc    Get a user by id
	// @access  Authenticated, Admin
	.get('/:userId', authorizeAdmin, async (req, res) => {
		try {
			const { userId } = req.params
			const user = await User.findUserById(userId)
			res.status(200).json({ user: user })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

router
	.route('/:userId/password')
	// @route   PUT api/user/:userId/password
	// @desc    Update user password
	// @access  Authenticated, Admin
	.put(authorizeAdmin, multer.none(), async (req, res) => {
		try {
			const { userId } = req.params
			const { password } = req.body
			const { user } = await User.updatePassword(userId, password)
			res.status(200).json({ success: true })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

// export router
module.exports = router
