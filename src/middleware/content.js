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

/**
 *
 * @param {request} req - requires req.params.contentId, req.studentId
 * @param {response} res
 * @param {next} next
 */
module.exports.completeContentForStudent = async (req, res, next) => {
	try {
		const { contentId } = req.params
		if (!contentId)
			throw new ReferenceError('`req.params.contentId` is required')
		const { studentId } = req
		if (!studentId) throw new ReferenceError('`req.studentId` is required')

		await Content.markCompleteForStudent(contentId, studentId, 100)
		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}

/**
 * Toggle content.isPublished on a content
 * @param {request} req - req.params.contentId is required
 * @param {response} res
 * @param {next} next
*/
module.exports.toggleContentPublished = async (req, res, next) => {
	try {
		const { contentId } = req.params
		if (!contentId)
			throw new ReferenceError('`req.params.contentId` is required')

		const content = await Content.findContentById(contentId)
		const isPublished = !content.isPublished
		await Content.updateContent(contentId, { isPublished })
		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}

/**
 * Toggle content.isKeepOpen on a content
 * @param {request} req - req.params.contentId is required
 * @param {response} res
 * @param {next} next
 */
module.exports.toggleContentKeepOpen = async (req, res, next) => {
	try {
		const { contentId } = req.params
		if (!contentId)
			throw new ReferenceError('`req.params.contentId` is required')

		const content = await Content.findContentById(contentId)
		const isKeepOpen = !content.isKeepOpen
		await Content.updateContent(contentId, { isKeepOpen })
		next()
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}
