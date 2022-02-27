const path = require('path')
require('dotenv').config({ path: '.env' })
const quizDir = process.env.LOCAL_UPLOAD_PATH

// Quiz: mongoose model
// QuizVersion: mongoose model
// QuizSubmission: mongoose model
module.exports = makeStartQuiz = ({ Quiz, QuizVersion, QuizSubmission }) => {
	// Start a quiz
	// Resolve -> quiz questions json
	// Reject -> error name
	return async function startQuiz(quizId, userId) {
		try {
			// Find quiz in db
			const quiz = await Quiz.findById(quizId).populate('quizVersions').exec()
			if (!quiz) {
				throw new ReferenceError('Quiz not found in db')
			}

			// Find active quiz version doc
			const activeQuizVersion = getActiveVersion(quiz)
			if (!activeQuizVersion)
				throw new ReferenceError(
					'Active quiz version doc not found in `startQuiz`.'
				)

			// Check wether a quiz is already in progress for the user
			const submissionInProgress = await QuizSubmission.findOne()
				.where('userId')
				.equals(userId)
				.where('quizId')
				.equals(quizId)
				.where('submitted')
				.equals(false)
				.exec()
			if (submissionInProgress) {
				const submissionQuizVersion = getSubmissionQuizVersion(
					quiz,
					submissionInProgress
				)
				// Need to send back the quizVersion associated with the submission version
				return Promise.resolve({
					questions: getQuestionsNoAnswers(submissionQuizVersion),
					quizSubmission: submissionInProgress.toObject(),
				})
			}

			// TODO: Add max quizzes check

			// Find old Submissions
			const allSubmissions = await QuizSubmission.find()
				.where('userId')
				.equals(userId)
				.where('quizId')
				.equals(quizId)
				.exec()

			const quizSubmission = new QuizSubmission({
				userId,
				quizId,
				quizVersionId: activeQuizVersion._id,
				submitted: false,
				submissionNumber: allSubmissions.length + 1,
				userAnswers: [],
				answerOverrides: [],
				isGraded: false,
				grade: 0.0,
				dateStarted: Date.now(),
				dateFinished: null,
			})

			// Push new submission to the quiz version
			activeQuizVersion.quizSubmissions.push(quizSubmission)
			activeQuizVersion.markModified('quizSubmissions')

			await quizSubmission.save()
			await activeQuizVersion.save()

			return Promise.resolve({
				questions: getQuestionsNoAnswers(activeQuizVersion),
				quizSubmission: quizSubmission.toObject(),
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

const getQuestionsNoAnswers = (quizVersion) => {
	return quizVersion.questions.map((q) => {
		return {
			questionNumber: q.questionNumber,
			question: q.question,
			responses: q.responses,
			questionType: q.questionType,
			points: q.points,
		}
	})
}

function getActiveVersion(quiz) {
	return quiz.quizVersions
		.filter((quizVersion) => quiz.activeVersion == quizVersion.versionNumber)
		.shift()
}

function getSubmissionQuizVersion(quiz, submission) {
	return quiz.quizVersions
		.filter((quizVersion) => quizVersion._id.equals(submission.quizVersionId))
		.shift()
}
