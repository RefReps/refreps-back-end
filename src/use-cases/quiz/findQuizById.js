require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH
const path = require('path')

module.exports = makeFindQuizById = ({ Quiz, QuizJson }) => {
	// Finds a quiz by an ObjectId
	// Resolve -> {found: #, quiz: {object}}
	// Reject -> error
	return async function findQuizById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = {}

				const quizDoc = await Quiz.findById(id)
				if (quizDoc == null) {
					return reject(ReferenceError('No quiz found in db'))
				}
				const found = quizDoc.toObject()

				return resolve(found)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
