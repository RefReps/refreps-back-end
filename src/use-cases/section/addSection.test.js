const Section = require('../../database/models/section.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')

describe('addSection Test Suite', () => {
	const addSection = makeAddSection({ Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a section', async () => {
		const section = await addSection(makeFakeSection())
		expect(section.name).toBe(makeFakeSection().name)
	})
})
