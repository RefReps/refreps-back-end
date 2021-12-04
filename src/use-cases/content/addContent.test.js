const Content = require('../../database/models/content.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')

describe('addContent Test Suite', () => {
	const addContent = makeAddContent({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a content', async () => {
		const content = await addContent(makeFakeContent())
		expect(content.name).toBe(makeFakeContent().name)
	})

	it('fails to add content when required properties are not passed', async () => {
		let errorName = 'nothing'
		try {
			await addContent()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})

	it('fails to add a content that does not have valid properties', async () => {
		let errorName = 'nothing'
		try {
			await addContent(makeFakeContent({ name: '' }))
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})
})
