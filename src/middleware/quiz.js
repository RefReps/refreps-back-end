const { Quiz, QuizSubmission } = require('../use-cases/index')
const { buildErrorResponse } = require('../utils/responses/index')
const { request, response } = require('express')

/**
 *
 * @param {request} req - requires req.params = {quizId, submissionId, attemptNumber}
 * @param {response} res
 * @param {next} next
 */
module.exports.getStudentQuizAttempt = async (req, res, next) => {
	try {
		const { quizId, submissionId, attemptNumber } = req.params
		if (!(quizId || submissionId || attemptNumber)) {
			throw new ReferenceError(
				'`getStudentQuizAttempt` middleware is missing req.params'
			)
		}

		const quizSubmission = await QuizSubmission.findCompletedSubmission(
			submissionId
		)

		return res.status(200).json(quizSubmission)
	} catch (error) {
		return res.status(400).json(buildErrorResponse(error))
	}
}
