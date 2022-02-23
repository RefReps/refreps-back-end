const uuid = require('uuid').v4
require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH

module.exports = makeCopyQuiz = ({ Quiz, QuizJson }) => {
	// Copy a quiz
	// Resolve -> quiz object
	// Reject -> error name
	return async function copyQuiz(quizId) {
		return new Promise(async (resolve, reject) => {
			try {
				const oldQuiz = await Quiz.findById(quizId)

				if (!oldQuiz) {
					throw ReferenceError('Not Found')
				}

				const newFilename = `${uuid()}.json`

				const newQuiz = Object.assign(
					{},
					{
						name: oldQuiz.name,
						filename: newFilename,
						activeVersion: 0,
						quizVersions: [],
					}
				)

				// Get contents of old quiz
				const oldQuizPath = `${quizDir}${oldQuiz.filename}`
				const oldQuizData = await QuizJson.loadLocalQuiz(oldQuizPath)

				// Save old quiz contents in new quiz
				const newQuizPath = `${quizDir}${newQuiz.filename}`
				await QuizJson.saveLocalQuiz(newQuizPath, oldQuizData)

				const copyQuiz = new Quiz(newQuiz)

				const saved = await copyQuiz.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
