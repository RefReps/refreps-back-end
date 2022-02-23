const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')

describe('addContent Test Suite', () => {
	const addContent = makeAddContent({ Content, Module })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
		await Module.deleteMany({})
		await Module.insertMany([
			{
				_id: makeFakeContent().moduleId,
				name: 'module 1',
				sectionId: '6215a6cfecd53fdc1db41f31',
				isPublished: true,
				moduleOrder: 1,
				dropDate: null,
				contents: [],
			},
		])
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
