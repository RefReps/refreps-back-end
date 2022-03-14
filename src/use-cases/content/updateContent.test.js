const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')
const makeUpdateContent = require('./updateContent')

describe('updateContent Test Suite', () => {
	const addContent = makeAddContent({ Content, Module })
	const updateContent = makeUpdateContent({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully updates a content', async () => {
		const content1 = await addContent(makeFakeContent())

		const updated = await updateContent(content1._id, { name: 'Updated Name' })
		expect(updated.content.name).toEqual('Updated Name')
	})

	it('successfully resolves when the content is not found', async () => {
		const updated = await updateContent('6197ae39ef8716d0dd181e08')
		expect(updated).toMatchObject({ count: 0, content: {} })
	})

	it('rejects if `id` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await updateContent()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})
})
