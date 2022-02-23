const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')
const makeFindAllContents = require('./findAllContents')

describe('findAllContents Test Suite', () => {
	const addContent = makeAddContent({ Content, Module })
	const findAllContents = makeFindAllContents({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds all contents within a course', async () => {
		const content1 = await addContent(
			makeFakeContent({ name: 'content1', contentOrder: 1 })
		)
		const content2 = await addContent(
			makeFakeContent({ name: 'content2', contentOrder: 2 })
		)
		const content3 = await addContent(
			makeFakeContent({ name: 'content3', contentOrder: 3 })
		)
		const content4 = await addContent(
			makeFakeContent({ name: 'content4', contentOrder: 4 })
		)
		const content5 = await addContent(
			makeFakeContent({ name: 'content5', contentOrder: 5 })
		)
		const diffContent = await addContent(
			makeFakeContent({
				name: 'not included',
				moduleId: '61a55df0eb19b75ef3139471',
			})
		)

		const { moduleId } = makeFakeContent()
		const foundContents = await findAllContents(moduleId)
		expect(foundContents.found).toBe(5)
		expect(foundContents.contents).toEqual([
			content1,
			content2,
			content3,
			content4,
			content5,
		])
	})

	it('returns found of 0 if no contents are found', async () => {
		const results = await findAllContents('61a55df0eb19b75ef3139471')
		expect(results).toMatchObject({ found: 0, contents: [] })
	})

	it('rejects if no moduleId is provided', async () => {
		let errorMessage = 'nothing'
		try {
			await findAllContents()
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe('moduleId is undefined')
	})

	it('includes non published courses if specified', async () => {
		await addContent(makeFakeContent({ isPublished: false }))
		await addContent(makeFakeContent({ isPublished: true }))

		const { moduleId } = makeFakeContent()

		const resultsPublishedOnly = await findAllContents(moduleId, {
			publishedOnly: true,
		})
		expect(resultsPublishedOnly.found).toBe(1)

		const resultsNonPublished = await findAllContents(moduleId, {
			publishedOnly: false,
		})
		expect(resultsNonPublished.found).toBe(2)
	})
})
