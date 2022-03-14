const { User } = require('../../use-cases/index')
const { buildErrorResponse } = require('../responses/index')
const { request, response } = require('express')

// requires req.email
// updates req.userId
/**
 * Binds a user id to req.userId given req.email exists
 * @param {request} req - request from REST
 * @param {response} res - response from REST
 * @param {next} next - next middleware
 * @returns void if going to next middleware, or void if error
 */
module.exports.bindUserIdFromEmail = async (req, res, next) => {
	try {
		const { email } = req
		if (!email) throw new ReferenceError('req.email must be provided')

		const user = await User.findUserByEmail(email)
		req.userId = user._id

		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}
