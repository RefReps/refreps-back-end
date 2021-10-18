const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const conn = require('./../server/dbConnection')
const { registerValidation, loginValidation } = require('../utils/validation')
require('dotenv').config({ path: '.env' })

router.route('/register').post(async (req, res) => {
	// Validate data before creating new user
	const { error } = registerValidation(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	// Check if email already exists
	const emailExists = await conn.models.User.findOne({
		email: req.body.email,
	}).exec()
	if (emailExists) return res.status(400).send('Email already exists')

	// Hash password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(req.body.password, salt)

	// Create new user
	const user = new conn.models.User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	})
	try {
		const savedUser = await user.save()
		res.send({ user: user._id })
	} catch (err) {
		res.status(400).send(err)
	}
})

router.route('/login').post(async (req, res) => {
	const { error } = loginValidation(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	// Check if email exists
	const user = await conn.models.User.findOne({
		email: req.body.email,
	}).exec()
	if (!user) return res.status(400).send('Email is not found')

	// Passowrd is correct
	const validPass = await bcrypt.compare(req.body.password, user.password)
	if (!validPass) return res.status(400).send('Invalid password')

	// Create and assign a token
	const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET)
	res.header('auth-token', token).send(token)
})

module.exports = router
