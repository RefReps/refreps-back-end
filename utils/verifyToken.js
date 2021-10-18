const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
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
