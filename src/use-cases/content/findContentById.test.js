const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')
const makeFindContentById = require('./findContentById')

describe('findContentById Test Suite', () => {
	const addContent = makeAddContent({ Content, Module })
	const findContentById = makeFindContentById({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds a content by id', async () => {
		const content1 = await addContent(makeFakeContent({ name: 'content1' }))

		const found = await findContentById(content1._id)
		expect(found).toMatchObject(content1)
	})

	it('finds the right content given multiple entries', async () => {
		const content1 = await addContent(makeFakeContent({ name: 'content1' }))
		const content2 = await addContent(makeFakeContent({ name: 'content2' }))
		const content3 = await addContent(makeFakeContent({ name: 'content3' }))

		const found = await findContentById(content2._id)
		expect(found).toMatchObject(content2)
	})

	it('successfully finds 0 when the content is in the db', async () => {
		await expect(
			findContentById('6197ae39ef8716d0dd181e08')
		).resolves.toMatchObject({})
	})

	it('CastError when the id is not an ObjectId', async () => {
		let errorName = 'nothing'
		try {
			await findContentById('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})
})
