const {
	loadLocalQuiz,
	saveLocalQuiz,
	condenseOrdering,
	validateQuizQuestionData,
	validateQuizRootData,
} = require('./quizJson')
const fs = require('fs')
const fsPromise = fs.promises

const testDir = '__test__/temp/'
const quizName = 'test-quiz.json'
const quizPath = `${testDir}${quizName}`
let quizContent = {
	questions: {
		1: {
			type: '1_CHOICE',
			question: 'What is my favorite color?',
			responses: {
				A: 'Aqua',
				B: 'Black',
				C: 'Cream',
				D: 'Dark Orange',
			},
			answers: ['A', 'C'],
		},
	},
}

describe('loadQuiz Test Suite', () => {
	beforeAll(async () => {
		if (!fs.existsSync(testDir)) {
			fs.mkdirSync(testDir)
		}
	})

	it('successfully loads a quiz', async () => {
		await fsPromise.writeFile(quizPath, JSON.stringify(quizContent))

		const quiz = await loadLocalQuiz(quizPath)
		expect(quiz).toEqual(quizContent)
	})

	it('throws ReferenceError when quiz is not found', async () => {
		let error = 'Nothing'
		try {
			const quiz = await loadLocalQuiz(`${testDir}no-quiz-here.json`)
			console.log(quiz)
		} catch (err) {
			error = err.name
		}
		expect(error).toBe('ReferenceError')
	})
})

describe('saveLocalQuiz Test Suite', () => {
	beforeAll(async () => {
		// Create a temp file for testing
		if (!fs.existsSync(testDir)) {
			fs.mkdirSync(testDir)
		}
	})

	beforeEach(async () => {
		// Make a quiz for the start of each test in this suite
		await fsPromise.writeFile(quizPath, JSON.stringify(quizContent))
	})

	afterEach(async () => {
		fs.unlinkSync(quizPath)
	})

	it('successfully updates a quiz file', async () => {
		const contentAdding = {
			2: {
				type: '1_CHOICE',
				question: 'What is my favorite number?',
				responses: {
					A: '1',
					B: '2',
					C: '3',
					D: '6',
				},
				answers: ['A', 'D'],
			},
		}
		await saveLocalQuiz(quizPath, contentAdding)
	})
})

describe('validateQuizQuestionData Test Suite', () => {
	it('successfully validates a 1_CHOICE', async () => {
		const questionData = {
			type: '1_CHOICE',
			question: 'What is my favorite color?',
			responses: {
				A: 'Aqua',
				B: 'Black',
				C: 'Cream',
				D: 'Dark Orange',
			},
			answers: ['A', 'C'],
		}
		expect(validateQuizQuestionData(questionData)).toBe(true)
	})

	it('successfully validates a MULTI_CHOICE', async () => {
		const questionData = {
			type: 'MULTI_CHOICE',
			question: 'What is my favorite color?',
			responses: {
				A: 'Aqua',
				B: 'Black',
				C: 'Cream',
				D: 'Dark Orange',
			},
			answers: ['A', 'D'],
		}
		expect(validateQuizQuestionData(questionData)).toBe(true)
	})

	it('successfully validates a TRUE_FALSE type', async () => {
		const questionData = {
			type: 'TRUE_FALSE',
			question: 'My favorite number is 6.',
			answer: 'true',
		}
		expect(validateQuizQuestionData(questionData)).toBe(true)
	})

	it('successfully validates a FREE_RESPONSE', async () => {
		const questionData = {
			type: 'FREE_RESPONSE',
			question: 'What is my favorite color?',
			answers: ['blue', 'BLUE', 'Blue'],
		}
		expect(validateQuizQuestionData(questionData)).toBe(true)
	})

	it('returns false if single_choice is not matching the schema', async () => {
		const questionData = {
			type: '1_CHOICE',
			question: 'What is my favorite color?',
			responses: {
				A: 'Aqua',
				B: 'Black',
				C: 'Cream',
				E: 'Dark Orange', // Not using D
			},
			answers: ['A', 'C'],
		}
		expect(validateQuizQuestionData(questionData)).toBe(false)
	})

	it('returns false if correct schema but wrong type declared', async () => {
		const questionData = {
			type: 'TRUE_FALSE', // Incorrect type declared for the schema
			question: 'What is my favorite color?',
			responses: {
				A: 'Aqua',
				B: 'Black',
				C: 'Cream',
				D: 'Dark Orange',
			},
			answers: ['A', 'C'],
		}
		expect(validateQuizQuestionData(questionData)).toBe(false)
	})

	it('returns false there is no question type', async () => {
		const questionData = {
			question: 'What is my favorite color?',
			responses: {
				A: 'Aqua',
				B: 'Black',
				C: 'Cream',
				D: 'Dark Orange',
			},
			answers: ['A', 'C'],
		}
		expect(validateQuizQuestionData(questionData)).toBe(false)
	})
})

describe('validateQuizRootData Test Suite', () => {
	it('returns true on a quiz with no questions', async () => {
		const quizRoot = {
			name: 'quiz 1',
			questions: {},
		}
		expect(validateQuizRootData(quizRoot)).toBe(true)
	})

	it('returns false on a quiz no name', async () => {
		const quizRoot = {
			questions: {},
		}
		expect(validateQuizRootData(quizRoot)).toBe(false)
	})

	it('returns true when a quiz has questions', async () => {
		const quizRoot = {
			name: 'quiz 1',
			questions: {
				1: {
					type: '1_CHOICE',
					question: 'What is my favorite color?',
					responses: {
						A: 'Aqua',
						B: 'Black',
						C: 'Cream',
						D: 'Dark Orange',
					},
					answers: ['A', 'C'],
				},
				2: {
					type: 'MULTI_CHOICE',
					question: 'What is my favorite color?',
					responses: {
						A: 'Aqua',
						B: 'Black',
						C: 'Cream',
						D: 'Dark Orange',
					},
					answers: ['A', 'C'],
				},
			},
		}
		expect(validateQuizRootData(quizRoot)).toBe(true)
	})

	it('returns false when a quiz has questions incorrectly formatted', async () => {
		const quizRoot = {
			name: 'quiz 1',
			questions: {
				1: {
					type: '1_CHOICE',
					question: 'What is my favorite color?',
					responses: {
						A: 'Aqua',
						B: 'Black',
						C: 'Cream',
						D: 'Dark Orange',
					},
					answers: ['A', 'C'],
				},
				2: {
					type: 'MULTI_CHOICE',
					question: 'What is my favorite color?',
					responses: {
						A: 'Aqua',
						B: 'Black',
						C: 'Cream',
						// Does not include Option D
					},
					answers: ['A', 'C'],
				},
			},
		}
		expect(validateQuizRootData(quizRoot)).toBe(false)
	})
})

describe('condenseOrdering Test Suite', () => {
	it('successfully returns the condensed order of questions', async () => {
		const quizRoot = {
			name: 'quiz 1',
			questions: {
				1: {},
				3: {},
			},
		}
		expect(condenseOrdering(quizRoot)).toEqual({
			name: 'quiz 1',
			questions: {
				1: {},
				2: {},
			},
		})
	})

	it('successfully returns the condensed order of questions', async () => {
		const quizRoot = {
			name: 'quiz 1',
			questions: {
				1: {},
				3: {},
				5: {},
				44: {},
			},
		}
		expect(condenseOrdering(quizRoot)).toEqual({
			name: 'quiz 1',
			questions: {
				1: {},
				2: {},
				3: {},
				4: {},
			},
		})
	})

	it('throws Reference error if not valid quiz root', async () => {
		const quizRoot = {
			// missing name
			questions: {
				1: {},
			},
		}

		let error = 'Nothing'
		try {
			condenseOrdering(quizRoot)
		} catch (err) {
			error = err.name
		}
		expect(error).toBe('ReferenceError')
	})
})
