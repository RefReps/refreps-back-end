// Middleware to handle if the user is logged in on their browser

const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })

module.exports = (req, res, next) => {
	if (process.env.ENVIRONMENT.toLocaleLowerCase() == 'dev') {
		next()
		return
	}

	// Check if auth-token exists
	const token = req.header('auth-token')
	if (!token) return res.status(401).send('Access Denied')

	// Check if auth-token is legit
	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET)
		req.user = verified
		next()
	} catch (err) {
		res.status(400).send('Invalid Token')
	}
}
