const Module = require('../../database/models/module.model')
const Section = require('../../database/models/section.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')
const makeUpdateModule = require('./updateModule')

describe('updateModule Test Suite', () => {
	const addModule = makeAddModule({ Module, Section })
	const updateModule = makeUpdateModule({ Module })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully updates a module', async () => {
		const module1 = await addModule(makeFakeModule())

		const updated = await updateModule(module1._id, { name: 'Updated Name' })
		expect(updated.module.name).toEqual('Updated Name')
	})

	it('successfully resolves when the module is not found', async () => {
		const updated = await updateModule('6197ae39ef8716d0dd181e08')
		expect(updated).toMatchObject({ count: 0, module: {} })
	})

	it('rejects if `id` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await updateModule()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})
})
