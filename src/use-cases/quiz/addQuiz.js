const fs = require('fs')
const uuid = require('uuid').v4
require('dotenv').config({ path: '.env' })
const quizPath = process.env.LOCAL_UPLOAD_PATH

// Quiz: mongoose model
// QuizJson: Custom Util in this project
module.exports = makeAddQuiz = ({ Quiz, QuizJson }) => {
	// Save a new quiz in the db
	// Resolve -> quiz object
	// Reject -> error name
	return async function addQuiz(quizInfo = {}) {
		return new Promise(async (resolve, reject) => {
			let uniqueFilename = `${uuid()}.json`

			// Add new quiz reference in db
			const quiz = new Quiz({ ...quizInfo, filename: uniqueFilename })
			try {
				QuizJson.touch(`${quizPath}${uniqueFilename}`)
				const saved = await quiz.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
