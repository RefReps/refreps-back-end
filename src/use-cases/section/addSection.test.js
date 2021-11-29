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

	it('fails to add section when required properties are not passed', async () => {
		await expect(addSection()).rejects.toBe('ValidationError')
	})

	it('fails to add a section that does not have valid properties', async () => {
		await expect(addSection(makeFakeSection({ name: '' }))).rejects.toBe(
			'ValidationError'
		)
	})
})
