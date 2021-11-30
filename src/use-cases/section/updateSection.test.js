const Section = require('../../database/models/section.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeUpdateSection = require('./updateSection')

describe('updateSection Test Suite', () => {
	const addSection = makeAddSection({ Section })
	const updateSection = makeUpdateSection({ Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully updates a section', async () => {
		const section1 = await addSection(makeFakeSection())

		const updated = await updateSection(section1._id, { name: 'Updated Name' })
		expect(updated.section.name).toEqual('Updated Name')
	})

	it('successfully resolves when the section is not found', async () => {
		const updated = await updateSection('6197ae39ef8716d0dd181e08')
		expect(updated).toMatchObject({ count: 0, section: {} })
	})
})
