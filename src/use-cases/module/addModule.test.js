const Module = require('../../database/models/module.model')
const Section = require('../../database/models/section.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')

describe('addModule Test Suite', () => {
	const addModule = makeAddModule({ Module, Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
		await Section.deleteMany({})
		await Section.insertMany([
			{
				_id: makeFakeModule().sectionId,
				name: 'Section 1',
				courseId: '6215a6cfecd53fdc1db41f31',
				isPublished: true,
				sectionOrder: 1,
				dropDate: null,
				modules: [],
			},
		])
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a module', async () => {
		const module = await addModule(makeFakeModule())
		expect(module.name).toBe(makeFakeModule().name)
	})

	it('fails to add module when required properties are not passed', async () => {
		let errorName = 'nothing'
		try {
			await addModule()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})

	it('fails to add a module that does not have valid properties', async () => {
		let errorName = 'nothing'
		try {
			await addModule(makeFakeModule({ name: '' }))
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})
})
