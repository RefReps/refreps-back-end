const { response, request } = require('express')
const { buildErrorResponse } = require('../utils/responses/index')
const { Content } = require('../use-cases/index')

/**
 * Updates a content's drop date. The date provided must be in
 * standard milliseconds.
 * Date should be in UTC
 * @param {request} req - req.body.date and req.params.contentId is required
 * @param {response} res
 * @param {next} next
 */
module.exports.updateContentDropDate = async (req, res, next) => {
	try {
		const { date } = req.body
		if (!date) throw new ReferenceError('req.body.date is required')

		const { contentId } = req.params
		if (!contentId) throw new ReferenceError('req.params.contentId is required')

		const payload = {}
		payload.dropDate = getDateIfValid(date)
		await Content.updateContent(contentId, payload)

		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}

const getDateIfValid = (date) => {
	let dateError = new TypeError('Date is not valid.')
	try {
		date = parseInt(date)
	} catch (error) {}
	date = new Date(date)
	if (date == 'Invalid Date') throw dateError
	return date
}
