module.exports = makeFindContentQuizBelongsTo = ({ Quiz, Content }) => {
	// Finds a content based on the quiz
	// Resolve -> {quiz: quiz object}
	// Reject -> error
	return async function findContentQuizBelongsTo(quizId) {
		try {
			const contentDoc = await Content.findOne()
				.where('toDocument')
				.equals(quizId)
				.where('onModel')
				.equals('Quiz')
				.exec()
			if (contentDoc == null)
				throw new ReferenceError('No content doc found in db.')

			return Promise.resolve({ content: contentDoc.toObject() })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
