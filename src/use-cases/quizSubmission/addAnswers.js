module.exports = makeAddAnswers = ({QuizSubmission}) => {
    /**
     * submissionId: ObjectId - Mongodb ObjectId
     * answers: [{questionNumber: Integer, answers: [string,...]}]
     */
    return async function addAnswers(submissionId, answers = []) {
        try {
            if (!submissionId) throw new ReferenceError('`submissionId` must be provided in addAnswers.')
            if (answers.length === 0) throw new ReferenceError('`answers` list must be greater than 0.')

            // Find the submission and make sure that it is not already submitted
            const submission = await QuizSubmission.findById(submissionId).where('submitted').equals(false).exec()
            if (!submission) {
                throw new ReferenceError('Submission doc not found.')
            }

            // TODO: validate incoming answers check (compare with versioned quiz for choice type)

            submission.set('userAnswers', 
                await removeOldAnswersOnOverride(submission.userAnswers, answers)
            )
            submission.markModified('userAnswers')
            await submission.save()

            return Promise.resolve(submission)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

/**
 * Removes answer duplicates (favoring newAnswers)
 * @param {[]} oldAnswers 
 * @param {[]} newAnswers 
 */
const removeOldAnswersOnOverride = async (oldAnswers, newAnswers) => {
    const answers = []
    for (const oldAnswer of oldAnswers) {
        let isIn = false
        for (const newAnswer of newAnswers) {
            if (oldAnswer.questionNumber == newAnswer.questionNumber) {
                isIn = true
            }
        }
        if (!isIn) {
            answers.push(oldAnswer)
        }
    }
    answers.push(...newAnswers)
    return answers
}