const QuestionType = require('../enums/QuestionType')
const { validateQuestion } = require('./questionValidator')

describe('questionValidator Test Suite', () => {
	function fakeQuestionBase(overrides) {
		const question = {
			questionNumber: 1,
			question: 'Hello World!',
			responses: undefined,
			answers: undefined,
			questionType: undefined,
			points: 1,
		}
		return question
	}
	function fakeValid1Choice(overrides) {
		return {
			...fakeQuestionBase(),
			responses: {
				A: 'A',
				B: 'B',
				C: 'C',
				D: 'D',
			},
			answers: ['A'],
			questionType: QuestionType.CHOICE_1,
			...overrides,
		}
	}
	function fakeValidMultiChoice(overrides) {
		return {
			...fakeQuestionBase(),
			responses: {
				A: 'A',
				B: 'B',
				C: 'C',
				D: 'D',
			},
			answers: ['A', 'B'],
			questionType: QuestionType.MULTI_CHOICE,
			...overrides,
		}
	}
	function fakeValidFreeResponse(overrides) {
		return {
			...fakeQuestionBase(),
			answers: ['Hello', 'HELLO', 'hello'],
			questionType: QuestionType.FREE_RESPONSE,
			...overrides,
		}
	}
	function fakeValidTrueFalse(overrides) {
		return {
			...fakeQuestionBase(),
			answers: ['true'],
			questionType: QuestionType.TRUE_FALSE,
			...overrides,
		}
	}

	it('verifies a 1 choice question', async () => {
		const question = fakeValid1Choice()
		expect(validateQuestion(question)).toBe(true)
	})

	it('returns false when a 1 choice question type is invalid', async () => {
		const question = fakeValid1Choice({ question: { invalid: 'yup' } })
		expect(validateQuestion(question)).toBe(false)
	})

	it('verifies a multi choice question', async () => {
		const question = fakeValidMultiChoice()
		expect(validateQuestion(question)).toBe(true)
	})

	it('returns false when a multi choice question is invalid', async () => {
		const question = fakeValidMultiChoice({ responses: ['A', 'B'] })
		console.log(question)
		expect(validateQuestion(question)).toBe(false)
	})

	it('verifies a free response question', async () => {
		const question = fakeValidFreeResponse()
		expect(validateQuestion(question)).toBe(true)
	})

	it('returns false when a free response question is invalid', async () => {
		const question = fakeValidFreeResponse({ points: -1 })
		expect(validateQuestion(question)).toBe(false)
	})

	it('verifies a true false question', async () => {
		const question = fakeValidFreeResponse()
		expect(validateQuestion(question)).toBe(true)
	})

	it('verifies a true false question when `true` and `false` are correct', async () => {
		const question = fakeValidTrueFalse({ answers: ['true', 'false'] })
		expect(validateQuestion(question)).toBe(true)
	})

	it('returns false when true false question contains non true false answer', async () => {
		const question = fakeValidTrueFalse({ answers: ['correct'] })
		expect(validateQuestion(question)).toBe(false)
	})

	it('returns false when the question is not a valid type', async () => {
		const question = fakeQuestionBase({ questionType: 'invalid type' })
		expect(validateQuestion(question)).toBe(false)
	})

	it('returns false when the question number is not type number', async () => {
		const question = fakeValid1Choice({ questionNumber: 'Hello' })
		expect(validateQuestion(question)).toBe(false)
	})

	it('returns false when the question responses is type array', async () => {
		const question = fakeValid1Choice({ responses: 'A' })
		expect(validateQuestion(question)).toBe(false)
	})

	it('returns false when the question responses contains non string values', async () => {
		const question = fakeValid1Choice({ responses: { A: { anotherObj: 'A' } } })
		expect(validateQuestion(question)).toBe(false)
	})

	it('returns false when the question answers is not an array', async () => {
		const question = fakeValid1Choice({
			answers: { A: 'correct', B: 'incorrect' },
		})
		expect(validateQuestion(question)).toBe(false)
	})

	it('returns false when the question answers has non string values in array', async () => {
		const question = fakeValid1Choice({
			answers: ['A', { B: 'correct' }],
		})
		expect(validateQuestion(question)).toBe(false)
	})

	it('returns false when the question points is not a number', async () => {
		const question = fakeValid1Choice({
			points: 'A lot',
		})
		expect(validateQuestion(question)).toBe(false)
	})
})
