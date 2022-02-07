const path = require('path')
require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH

// Quiz: mongoose model
// QuizSubmission: mongoose model
// QuizJson: Custom Util in this project
module.exports = makeStartQuiz = ({ Quiz, QuizSubmission, QuizJson }) => {
	// Start a quiz
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function startQuiz(quizId, userId) {
		return new Promise(async (resolve, reject) => {
			try {
				// Find quiz in db
				const quiz = await Quiz.findById(quizId)
				if (!quiz) {
					throw new ReferenceError('Quiz not found in db')
				}

				// Find quiz json in files
				const quizPath = path.join(quizDir, quiz.filename)
				let quizJson = await QuizJson.loadLocalQuiz(quizPath)
				if (!quizJson) {
					throw new ReferenceError('Quiz not found in files')
				}

				// Already a quiz in progress
				const submissionInProgress = await QuizSubmission.find()
					.where('userId')
					.equals(userId)
					.where('quizId')
					.equals(quizId)
					.where('submitted')
					.equals(false)
					.exec()
				if (submissionInProgress.length > 0) {
					return resolve(stripAnswers(quizJson))
				}

				// TODO: Add max quizzes check

				const quizSubmission = new QuizSubmission({
					userId,
					quizId,
					submitted: false,
					submissionNumber: 1,
					userAnswers: {},
					isGraded: false,
					grade: 0.0,
					dateStarted: Date.now(),
					dateFinished: null,
				})
				await quizSubmission.save()

				return resolve(stripAnswers(quizJson))
			} catch (error) {
				return reject(error)
			}
		})
	}
}

const stripAnswers = (quizRoot) => {
	quizData = Object.assign({}, quizRoot)
	try {
		for (const [num, question] of Object.entries(quizRoot.questions)) {
			if (question.answer) {
				delete quizData.questions[num].answer
			}
			if (question.answers) {
				delete quizData.questions[num].answers
			}
		}
		return quizData
	} catch (error) {
		throw error
	}
}
