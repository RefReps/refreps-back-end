const jwt = require('jsonwebtoken')

// Check if authenticated
// Updates req.email
const isAuthenticated = (req, res, next) => {
	try {
		if (!req.header('Authorization')) {
			throw new Error('Authorization Header required for route')
		}
		const authorization = req.header('Authorization')
		if (verifyToken(extractToken(authorization))) {
			const jwtObject = jwt.decode(extractToken(authorization))
			req.email = jwtObject.email
			next()
		} else {
			res.status(401).json({ success: false })
		}
	} catch (error) {
		res
			.status(400)
			.send({ success: false, error: error.name, reason: error.message })
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
