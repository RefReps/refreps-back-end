const Module = require('../../database/models/module.model')
const Section = require('../../database/models/section.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')
const makeFindModuleById = require('./findModuleById')

describe('findModuleById Test Suite', () => {
	const addModule = makeAddModule({ Module, Section })
	const findModuleById = makeFindModuleById({ Module })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds a module by id', async () => {
		const module1 = await addModule(makeFakeModule({ name: 'module1' }))

		const found = await findModuleById(module1._id)
		expect(found).toMatchObject(module1)
	})

	it('finds the right module given multiple entries', async () => {
		const module1 = await addModule(makeFakeModule({ name: 'module1' }))
		const module2 = await addModule(makeFakeModule({ name: 'module2' }))
		const module3 = await addModule(makeFakeModule({ name: 'module3' }))

		const found = await findModuleById(module2._id)
		expect(found).toMatchObject(module2)
	})

	it('successfully finds 0 when the module is in the db', async () => {
		await expect(
			findModuleById('6197ae39ef8716d0dd181e08')
		).resolves.toMatchObject({})
	})

	it('CastError when the id is not an ObjectId', async () => {
		let errorName = 'nothing'
		try {
			await findModuleById('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})
})
