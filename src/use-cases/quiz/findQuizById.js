require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH
const path = require('path')

module.exports = makeFindQuizById = ({ Quiz, QuizVersion }) => {
	// Finds a quiz by an ObjectId
	// Resolve -> {found: #, quiz: {object}}
	// Reject -> error
	return async function findQuizById(id) {
		try {
			const quizDoc = await Quiz.findById(id).populate('quizVersions').exec()
			if (!quizDoc) throw new ReferenceError('No quiz doc found in db.')

			const quizVersionDoc = getActiveVersion(quizDoc)
			if (!quizVersionDoc)
				throw new ReferenceError('No quizVersion doc found on quiz doc.')

			return Promise.resolve({
				quiz: quizDoc.toObject(),
				quizVersion: quizVersionDoc.toObject(),
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

function getActiveVersion(quiz) {
	return quiz.quizVersions
		.filter((quizVersion) => quiz.activeVersion == quizVersion.versionNumber)
		.shift()
}
