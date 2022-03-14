const { User } = require('../../use-cases/index')

/**
 * Authorizes an admin to the next middleware. REQUIRES req.email
 * to exists, or the middleware will automatically response with 401.
 * @param {*} req request: Requires req.email to exist
 * @param {*} res response
 * @param {*} next next middleware
 */
module.exports.authorizeAdmin = async (req, res, next) => {
	try {
		const email = req.email
		if (!email) {
			throw new Error('req.email not provided.')
		}
		const user = await User.findUserByEmail(email)
		if (user.role === 'admin') {
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
