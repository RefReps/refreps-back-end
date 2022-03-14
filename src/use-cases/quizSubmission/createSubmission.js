module.exports = makeCreateSubmission = ({QuizSubmission}) => {
    return async function createSubmission(userId, quizId, quizVersionId) {
        try {
            if (!userId) throw new ReferenceError('`userId` must be provided in createSubmission.')
            if (!quizId) throw new ReferenceError('`quizId` must be provided in createSubmission.')
            if (!quizVersionId) throw new ReferenceError('`quizVersionId` must be provided in createSubmission.')
            
            // Find previous submission count
            const submissions = await QuizSubmission.find(
                {userId, quizId}
            ).exec()

            // Create the new submission
            const submission = new QuizSubmission({
                userId,
                quizId,
                quizVersionId,
                submitted: false,
                submissionNumber: previousSubmissionCount(submissions) + 1,
                userAnswers: [],
                isGraded: false,
                grade: 0,
                dateStarted: Date.now(),
                dateFinished: undefined,
            })
            
            await submission.save()
            return Promise.resolve(submission.toObject())
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

/**
 * 
 * @param {[]} submissionList 
 * @returns number >= 0
 */
function previousSubmissionCount(submissionList) {
    return submissionList.length
}