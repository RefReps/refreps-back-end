module.exports = {
	findById: async function (quizId) {
		if (typeof quizId != 'string') {
			return undefined
		}
		return {
			name: 'mock-quiz-name',
			filename: 'mock-quiz-filename',
		}
	},
}
