const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
	// TODO: If authenticated, goto next middleware
	try {
		const authorization = req.header('Authorization').slice()
		if (verifyToken(extractToken(authorization))) {
			next()
		} else {
			res.status(401).send({ success: false })
		}
	} catch (error) {
		throw error
	}
}

const verifyToken = (token) => {
	let valid
	try {
		if (jwt.verify(token, process.env.TOKEN_SECRET)) {
			valid = true
		}
	} catch (error) {
		valid = false
	}
	return valid
}

module.exports = {
	isAuthenticated,
}

function extractToken(authorization) {
	return authorization.split(' ')[1]
}
