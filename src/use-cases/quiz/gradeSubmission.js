const path = require('path')
require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH

// Quiz: mongoose model
// QuizSubmission: mongoose model
// QuizJson: Custom Util in this project
module.exports = makeGradeSubmission = ({ Quiz, QuizJson, QuizSubmission }) => {
	// Save answers to a quiz
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function gradeSubmission(quizId, userId) {
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

				// Find and load the quiz
				const quiz = await Quiz.findById(quizId)
				const quizPath = path.join(quizDir, quiz.filename)
				const quizJson = await QuizJson.loadLocalQuiz(quizPath)

				const grade = compareAnswers(
					submissionInProgress.userAnswers,
					quizJson.questions
				)

				// save submitted=true
				submissionInProgress.submitted = true
				submissionInProgress.markModified('submitted')
				// save isGraded=true
				submissionInProgress.isGraded = true
				submissionInProgress.markModified('isGraded')
				// save submitted=true
				submissionInProgress.grade = grade
				submissionInProgress.markModified('grade')
				// Save the date finished
				submissionInProgress.dateFinished = Date.now()
				submissionInProgress.markModified('dateFinished')
				await submissionInProgress.save()

				return resolve(grade)
			} catch (error) {
				return reject(error)
			}
		})
	}
}

const compareAnswers = (actualAnswersData, quizQuestionData) => {
	let correct = 0
	const total = Object.keys(quizQuestionData).length
	for (const [num, question] of Object.entries(quizQuestionData)) {
		const actual = actualAnswersData[num]
		if (!actual) {
			continue
		}
		if (question.type == 'TRUE_FALSE') {
			if (compareAnswer(question.type, actual, question.answer)) {
				correct += 1
			}
		} else {
			if (compareAnswer(question.type, actual, question.answers)) {
				correct += 1
			}
		}
	}
	return correct / total
}

const compareAnswer = (type, userAnswer, actualAnswer) => {
	switch (type) {
		case '1_CHOICE':
			return actualAnswer.includes(userAnswer)
		case 'MULTI_CHOICE':
			return equalsIgnoreOrder(userAnswer.split(''), actualAnswer)
		case 'FREE_RESPONSE':
			return actualAnswer.includes(userAnswer)
		case 'TRUE_FALSE':
			return userAnswer == actualAnswer
		default:
			return false
	}
}

const equalsIgnoreOrder = (a, b) => {
	if (a.length !== b.length) return false
	const uniqueValues = new Set([...a, ...b])
	for (const v of uniqueValues) {
		const aCount = a.filter((e) => e === v).length
		const bCount = b.filter((e) => e === v).length
		if (aCount !== bCount) return false
	}
	return true
}
