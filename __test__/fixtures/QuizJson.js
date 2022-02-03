module.exports = {
	touch: async function () {
		return true
	},
	loadLocalQuiz: async function () {
		return {
			name: 'mock-quiz',
			questions: {},
		}
	},
	updateLocalQuiz: async function (path, data) {
		return Promise.resolve()
	},
	condenseOrdering: function (data) {
		return data
	},
	validateQuizQuestionData: function (data) {
		if (!data.type) {
			return false
		}
		return true
	},
	validateQuizRootData: function () {
		return true
	},
	localPath: function () {
		return ''
	},
}
