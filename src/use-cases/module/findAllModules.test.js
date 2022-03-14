const Module = require('../../database/models/module.model')
const Section = require('../../database/models/section.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')
const makeFindAllModules = require('./findAllModules')

describe('findAllModules Test Suite', () => {
	const addModule = makeAddModule({ Module, Section })
	const findAllModules = makeFindAllModules({ Module })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds all modules within a course', async () => {
		const module1 = await addModule(
			makeFakeModule({ name: 'module1', moduleOrder: 1 })
		)
		const module2 = await addModule(
			makeFakeModule({ name: 'module2', moduleOrder: 2 })
		)
		const module3 = await addModule(
			makeFakeModule({ name: 'module3', moduleOrder: 3 })
		)
		const module4 = await addModule(
			makeFakeModule({ name: 'module4', moduleOrder: 4 })
		)
		const module5 = await addModule(
			makeFakeModule({ name: 'module5', moduleOrder: 5 })
		)
		const diffModule = await addModule(
			makeFakeModule({
				name: 'not included',
				sectionId: '61a55df0eb19b75ef3139471',
			})
		)

		const { sectionId } = makeFakeModule()
		const foundModules = await findAllModules(sectionId)
		expect(foundModules.found).toBe(5)
		expect(foundModules.modules).toEqual([
			module1,
			module2,
			module3,
			module4,
			module5,
		])
	})

	it('returns found of 0 if no modules are found', async () => {
		const results = await findAllModules('61a55df0eb19b75ef3139471')
		expect(results).toMatchObject({ found: 0, modules: [] })
	})

	it('rejects if no sectionId is provided', async () => {
		let errorMessage = 'nothing'
		try {
			await findAllModules()
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe('sectionId is undefined')
	})

	it('includes non published modules if specified', async () => {
		await addModule(makeFakeModule({ isPublished: false }))
		await addModule(makeFakeModule({ isPublished: true }))

		const { sectionId } = makeFakeModule()

		const resultsPublishedOnly = await findAllModules(sectionId, {
			publishedOnly: true,
		})
		expect(resultsPublishedOnly.found).toBe(1)

		const resultsNonPublished = await findAllModules(sectionId, {
			publishedOnly: false,
		})
		expect(resultsNonPublished.found).toBe(2)
	})
})
