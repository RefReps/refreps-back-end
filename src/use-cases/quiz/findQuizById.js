require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_PATH_UPLOAD

module.exports = makeFindQuizById = ({ Quiz, QuizJson }) => {
	// Finds a quiz by an ObjectId
	// Resolve -> {found: #, quiz: {object}}
	// Reject -> error
	return async function findQuizById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = {}

				const quizDoc = await Quiz.findById(id).where(query).exec()
				if (quizDoc == null) {
					return reject(ReferenceError('No quiz found in db'))
				}
				const found = quizDoc.toObject()

				const data = await QuizJson.loadLocalQuiz(`${quizDir}${found.filename}`)

				return resolve(data)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
