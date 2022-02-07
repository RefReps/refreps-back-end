const path = require('path')
require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH

// Quiz: mongoose model
// QuizSubmission: mongoose model
// QuizJson: Custom Util in this project
module.exports = makeSaveAnswersInSubmission = ({ QuizSubmission }) => {
	// Save answers to a quiz
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function saveAnswersInSubmission(
		quizId,
		userId,
		userAnswers = {}
	) {
		return new Promise(async (resolve, reject) => {
			try {
				// Find the quiz in progress
				const submissionInProgress = await QuizSubmission.findOne()
					.where('userId')
					.equals(userId)
					.where('quizId')
					.equals(quizId)
					.where('submitted')
					.equals(false)
					.exec()
				if (!submissionInProgress) {
					throw new Error('Could not find submission for user')
				}

				// save incoming incomingAnswers to the submission
				submissionInProgress.set(
					'userAnswers',
					Object.assign(
						submissionInProgress.userAnswers || {},
						cleanIncomingAnswers(userAnswers)
					)
				)
				submissionInProgress.markModified('userAnswers')

				const log = await submissionInProgress.save()

				return resolve(submissionInProgress.userAnswers)
			} catch (error) {
				return reject(error)
			}
		})
	}
}

const cleanIncomingAnswers = (data) => {
	const cleanData = Object.assign({}, data)
	const reNum = /^(\d)*$/
	for (const [num, value] of Object.entries(data)) {
		if (!reNum.test(num)) {
			delete cleanData[num]
		} else if (!(typeof value == 'string' || typeof value == 'boolean')) {
			delete cleanData[num]
		}
	}
	return cleanData
}
