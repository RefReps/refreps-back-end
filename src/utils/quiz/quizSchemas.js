const oneChoiceSchema = {
	$schema: 'http://json-schema.org/draft-07/schema',
	$id: 'http://example.com/example.json',
	type: 'object',
	title: 'The root schema',
	description: 'The root schema comprises the entire JSON document.',
	default: {},
	examples: [
		{
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
	],
	required: ['type', 'question', 'responses', 'answers'],
	properties: {
		type: {
			$id: '#/properties/type',
			type: 'string',
			title: 'The type schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['1_CHOICE'],
		},
		question: {
			$id: '#/properties/question',
			type: 'string',
			title: 'The question schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['What is my favorite color?'],
		},
		responses: {
			$id: '#/properties/responses',
			type: 'object',
			title: 'The responses schema',
			description: 'An explanation about the purpose of this instance.',
			default: {},
			examples: [
				{
					A: 'Aqua',
					B: 'Black',
					C: 'Cream',
					D: 'Dark Orange',
				},
			],
			required: ['A', 'B', 'C', 'D'],
			properties: {
				A: {
					$id: '#/properties/responses/properties/A',
					type: 'string',
					title: 'The A schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Aqua'],
				},
				B: {
					$id: '#/properties/responses/properties/B',
					type: 'string',
					title: 'The B schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Black'],
				},
				C: {
					$id: '#/properties/responses/properties/C',
					type: 'string',
					title: 'The C schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Cream'],
				},
				D: {
					$id: '#/properties/responses/properties/D',
					type: 'string',
					title: 'The D schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Dark Orange'],
				},
			},
			additionalProperties: false,
		},
		answers: {
			$id: '#/properties/answers',
			type: 'array',
			title: 'The answers schema',
			description: 'An explanation about the purpose of this instance.',
			default: [],
			examples: [['A', 'C']],
			additionalItems: true,
			items: {
				$id: '#/properties/answers/items',
				anyOf: [
					{
						$id: '#/properties/answers/items/anyOf/0',
						type: 'string',
						title: 'The first anyOf schema',
						description: 'An explanation about the purpose of this instance.',
						default: '',
						examples: ['A', 'C'],
					},
				],
			},
		},
	},
	additionalProperties: true,
}

const multiChoiceSchema = {
	$schema: 'http://json-schema.org/draft-07/schema',
	$id: 'http://example.com/example.json',
	type: 'object',
	title: 'The root schema',
	description: 'The root schema comprises the entire JSON document.',
	default: {},
	examples: [
		{
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
	],
	required: ['type', 'question', 'responses', 'answers'],
	properties: {
		type: {
			$id: '#/properties/type',
			type: 'string',
			title: 'The type schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['MULTI_CHOICE'],
		},
		question: {
			$id: '#/properties/question',
			type: 'string',
			title: 'The question schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['What is my favorite color?'],
		},
		responses: {
			$id: '#/properties/responses',
			type: 'object',
			title: 'The responses schema',
			description: 'An explanation about the purpose of this instance.',
			default: {},
			examples: [
				{
					A: 'Aqua',
					B: 'Black',
					C: 'Cream',
					D: 'Dark Orange',
				},
			],
			required: ['A', 'B', 'C', 'D'],
			properties: {
				A: {
					$id: '#/properties/responses/properties/A',
					type: 'string',
					title: 'The A schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Aqua'],
				},
				B: {
					$id: '#/properties/responses/properties/B',
					type: 'string',
					title: 'The B schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Black'],
				},
				C: {
					$id: '#/properties/responses/properties/C',
					type: 'string',
					title: 'The C schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Cream'],
				},
				D: {
					$id: '#/properties/responses/properties/D',
					type: 'string',
					title: 'The D schema',
					description: 'An explanation about the purpose of this instance.',
					default: '',
					examples: ['Dark Orange'],
				},
			},
			additionalProperties: false,
		},
		answers: {
			$id: '#/properties/answers',
			type: 'array',
			title: 'The answers schema',
			description: 'An explanation about the purpose of this instance.',
			default: [],
			examples: [['A', 'C']],
			additionalItems: true,
			items: {
				$id: '#/properties/answers/items',
				anyOf: [
					{
						$id: '#/properties/answers/items/anyOf/0',
						type: 'string',
						title: 'The first anyOf schema',
						description: 'An explanation about the purpose of this instance.',
						default: '',
						examples: ['A', 'C'],
					},
				],
			},
		},
	},
	additionalProperties: true,
}

const trueFalseSchema = {
	$schema: 'http://json-schema.org/draft-07/schema',
	$id: 'http://example.com/example.json',
	type: 'object',
	title: 'The root schema',
	description: 'The root schema comprises the entire JSON document.',
	default: {},
	examples: [
		{
			type: 'TRUE_FALSE',
			question: 'Blue is my favorite color.',
			answer: true,
		},
	],
	required: ['type', 'question', 'answer'],
	properties: {
		type: {
			$id: '#/properties/type',
			type: 'string',
			title: 'The type schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['TRUE_FALSE'],
		},
		question: {
			$id: '#/properties/question',
			type: 'string',
			title: 'The question schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['Blue is my favorite color.'],
		},
		answer: {
			$id: '#/properties/answer',
			type: 'boolean',
			title: 'The answer schema',
			description: 'An explanation about the purpose of this instance.',
			default: false,
			examples: [true],
		},
	},
	additionalProperties: false,
}

const freeResponseSchema = {
	$schema: 'http://json-schema.org/draft-07/schema',
	$id: 'http://example.com/example.json',
	type: 'object',
	title: 'The root schema',
	description: 'The root schema comprises the entire JSON document.',
	default: {},
	examples: [
		{
			type: 'FREE_RESPONSE',
			question: 'What is my favorite color?',
			answers: ['green', 'Green', 'GREEN'],
			'case-sensitive': true,
		},
	],
	required: ['type', 'question', 'answers'],
	properties: {
		type: {
			$id: '#/properties/type',
			type: 'string',
			title: 'The type schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['FREE_RESPONSE'],
		},
		question: {
			$id: '#/properties/question',
			type: 'string',
			title: 'The question schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['What is my favorite color?'],
		},
		answers: {
			$id: '#/properties/answers',
			type: 'array',
			title: 'The answers schema',
			description: 'An explanation about the purpose of this instance.',
			default: [],
			examples: [['green', 'Green']],
			additionalItems: true,
			items: {
				$id: '#/properties/answers/items',
				anyOf: [
					{
						$id: '#/properties/answers/items/anyOf/0',
						type: 'string',
						title: 'The first anyOf schema',
						description: 'An explanation about the purpose of this instance.',
						default: '',
						examples: ['green', 'Green'],
					},
				],
			},
		},
	},
	additionalProperties: false,
}

const quizRootSchema = {
	$schema: 'http://json-schema.org/draft-07/schema',
	$id: 'http://example.com/example.json',
	type: 'object',
	title: 'The root schema',
	description: 'The root schema comprises the entire JSON document.',
	default: {},
	examples: [
		{
			name: 'quiz 1',
			questions: {},
		},
	],
	required: ['name', 'questions'],
	properties: {
		name: {
			$id: '#/properties/name',
			type: 'string',
			title: 'The name schema',
			description: 'An explanation about the purpose of this instance.',
			default: '',
			examples: ['quiz 1'],
		},
		questions: {
			$id: '#/properties/questions',
			type: 'object',
			title: 'The questions schema',
			description: 'An explanation about the purpose of this instance.',
			default: {},
			examples: [{}],
			required: [],
			additionalProperties: true,
		},
	},
	additionalProperties: false,
}

module.exports = {
	oneChoiceSchema,
	multiChoiceSchema,
	trueFalseSchema,
	freeResponseSchema,

	quizRootSchema,
}

// let responses = {
// 	id: '/Responses',
// 	type: 'object',
// 	properties: {
// 		A: { type: 'string' },
// 		B: { type: 'string' },
// 		C: { type: 'string' },
// 		D: { type: 'string' },
// 	},
// 	required: ['A', 'B', 'C', 'D'],
// }

// let single_choice = {
// 	id: '/1_CHOICE',
// 	type: 'object',
// 	properties: {
// 		type: { type: 'string' },
// 		question: { type: 'string' },
// 		responses: {
// 			type: { $ref: '/Responses' },
// 		},
// 		answers: { type: 'array', items: 'string' },
// 	},
// 	required: ['type', 'question', 'responses', 'answers'],
// }

// let multi_choice = {
// 	id: '/MULTI_CHOICE',
// 	type: 'object',
// 	properties: {
// 		type: { type: 'string' },
// 		question: { type: 'string' },
// 		responses: {
// 			type: { $ref: '/Responses' },
// 		},
// 		answers: { type: 'array', items: 'string' },
// 	},
// 	required: ['type', 'question', 'responses', 'answers'],
// }

// let true_false = {
// 	id: '/TRUE_FALSE',
// 	type: 'object',
// 	properties: {
// 		type: { type: 'string' },
// 		question: { type: 'string' },
// 		answer: { type: 'boolean' },
// 	},
// 	required: ['type', 'question', 'responses', 'answers'],
// }

// let quiz = {
// 	id: '/Quiz',
// 	type: 'object',
// 	properties: {
// 		name: { type: 'string' },
//         questions: {
//             type: 'array',
//             items: 'string'
//         }
// 	},
// }
