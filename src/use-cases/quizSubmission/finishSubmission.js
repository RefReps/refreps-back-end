module.exports = makeFinishSubmission = ({ QuizSubmission }) => {
	return async function createSubmission(submissionId) {
		try {
			if (!submissionId)
				throw new ReferenceError(
					'`submissionId` must be provided in createSubmission.'
				)

			// Find previous submission count
			const submission = await QuizSubmission.findById(submissionId)
				.where('submitted')
				.equals(false)
				.populate('quizVersionId')
				.exec()
			if (!submission)
				throw new ReferenceError('Quiz submission not found to finish.')

			// Find quiz version' answers
			const quizVersion = submission.quizVersionId
			if (!quizVersion)
				throw new ReferenceError(
					'Quiz Version not found to compare answers with.'
				)

			// Grade quiz by comparing quiz version answers to this submission's answers
			submission.set('grade', gradeResponses(submission, quizVersion.questions))
			submission.markModified('grade')

			submission.set('isGraded', true)
			submission.markModified('isGraded')

			submission.set('dateFinished', Date.now())
			submission.markModified('dateFinished')

			submission.set('submitted', true)
			submission.markModified('submitted')

			await submission.save()

			return Promise.resolve(submission.toObject())
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

function gradeResponses(submission, quizQuestions) {
	const userAnswers = submission.userAnswers
	let totalPoints = 0
	let maxPoints = 0
	quizQuestions.forEach((question) => {
		const userAnswer = userAnswers.find(
			({ questionNumber }) => questionNumber == question.questionNumber
		)

		// Question is not answered
		if (!userAnswer) {
			pushAnswerToOverrides(submission, question.questionNumber, {
				isCorrect: false,
				isPointDifferent: true,
				pointAward: 0,
			})
		}
		// Question is answered and is correct
		else if (isCorrectAnswer(userAnswer, question)) {
			totalPoints += question.points
			pushAnswerToOverrides(submission, question.questionNumber, {
				isCorrect: true,
				isPointDifferent: false,
				pointAward: question.points,
			})
		}
		// Question is answered and is incorrect
		else {
			totalPoints += 0
			pushAnswerToOverrides(submission, question.questionNumber, {
				isCorrect: false,
				isPointDifferent: false,
				pointAward: 0,
			})
		}
		maxPoints += question.points
	})

	// Return the percentage of the quiz
	if (maxPoints == 0) return 1
	return totalPoints / maxPoints
}

function pushAnswerToOverrides(
	submission,
	questionNumber,
	data = { isCorrect: true, isPointDifferent: false, pointAward: 0 }
) {
	submission.answerOverrides.push({
		questionNumber,
		...data,
	})
	submission.markModified('answerOverrides')
}

function isCorrectAnswer(userAnswer, quizQuestion) {
	switch (quizQuestion.questionType) {
		case '1_CHOICE':
			return grade1Choice(userAnswer.answers, quizQuestion.answers)
		case 'MULTI_CHOICE':
			return gradeMultiChoice(userAnswer.answers, quizQuestion.answers)
		case 'FREE_RESPONSE':
			return gradeFreeResponse(userAnswer.answers, quizQuestion.answers)
		case 'TRUE_FALSE':
			return gradeTrueFalse(userAnswer.answers, quizQuestion.answers)
	}
}

/**
 * Grade when the question type is `1_CHOICE`
 * @param {[]} actualAnswer
 * @param {[]} expectedAnswer
 * @returns boolean
 */
function grade1Choice(actualAnswer, expectedAnswer) {
	return expectedAnswer.includes(actualAnswer.shift())
}

/**
 * Grade when the question type is `MULTI_CHOICE`
 * @param {[]} actualAnswer
 * @param {[]} expectedAnswer
 * @returns boolean
 */
function gradeMultiChoice(actualAnswer, expectedAnswer) {
	return arraysParseToSameSet(actualAnswer, expectedAnswer)
}

/**
 * Grade when the question type is `FREE_RESPONSE`
 * @param {[]} actualAnswer
 * @param {[]} expectedAnswer
 * @returns boolean
 */
function gradeFreeResponse(actualAnswer, expectedAnswer) {
	return expectedAnswer.includes(actualAnswer.shift())
}

/**
 * Grade when the question type is `TRUE_FALSE`
 * @param {[]} actualAnswer
 * @param {[]} expectedAnswer
 * @returns boolean
 */
function gradeTrueFalse(actualAnswer, expectedAnswer) {
	return expectedAnswer.includes(actualAnswer.shift())
}

const arraysParseToSameSet = (a, b) => {
	if (a.length !== b.length) return false
	const uniqueValues = new Set([...a, ...b])
	for (const v of uniqueValues) {
		const aCount = a.filter((e) => e === v).length
		const bCount = b.filter((e) => e === v).length
		if (aCount !== bCount) return false
	}
	return true
}
