const Module = require('../../database/models/module.model')
const Section = require('../../database/models/section.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')
const makeMoveModuleOrder = require('./moveModuleOrder')

describe('moveModuleOrder Test Suite', () => {
	const addModule = makeAddModule({ Module, Section })
	const moveModuleOrder = makeMoveModuleOrder({ Module })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('changes nothing when the new order is the old order', async () => {
		const module1 = await addModule(
			makeFakeModule({ name: 'module1', moduleOrder: 1 })
		)

		const result = await moveModuleOrder(module1._id, 1)
		expect(result.changed).toBe(0)
	})

	it('changes the order of the first element going to the last', async () => {
		const module1 = await addModule(
			makeFakeModule({ name: 'module1', moduleOrder: 1 })
		)
		await addModule(makeFakeModule({ name: 'module2', moduleOrder: 2 }))
		await addModule(makeFakeModule({ name: 'module3', moduleOrder: 3 }))
		await addModule(makeFakeModule({ name: 'module4', moduleOrder: 4 }))

		const result = await moveModuleOrder(module1._id, 4)
		expect(result.changed).toBe(4)
	})

	it('changes the order of the last element to the first element', async () => {
		await addModule(makeFakeModule({ name: 'module1', moduleOrder: 1 }))
		await addModule(makeFakeModule({ name: 'module2', moduleOrder: 2 }))
		await addModule(makeFakeModule({ name: 'module3', moduleOrder: 3 }))
		const module4 = await addModule(
			makeFakeModule({ name: 'module4', moduleOrder: 4 })
		)

		const result = await moveModuleOrder(module4._id, 1)
		expect(result.changed).toBe(4)
	})

	it('changes the order of a middle element to 2 elements after', async () => {
		await addModule(makeFakeModule({ name: 'module1', moduleOrder: 1 }))
		const module2 = await addModule(
			makeFakeModule({ name: 'module2', moduleOrder: 2 })
		)
		await addModule(makeFakeModule({ name: 'module3', moduleOrder: 3 }))
		await addModule(makeFakeModule({ name: 'module4', moduleOrder: 4 }))
		await addModule(makeFakeModule({ name: 'module5', moduleOrder: 5 }))
		await addModule(makeFakeModule({ name: 'module6', moduleOrder: 6 }))

		const result = await moveModuleOrder(module2._id, 5)
		expect(result.changed).toBe(4)
	})

	it('changes the order of a middle element to 2 elements prior', async () => {
		await addModule(makeFakeModule({ name: 'module1', moduleOrder: 1 }))
		await addModule(makeFakeModule({ name: 'module2', moduleOrder: 2 }))
		await addModule(makeFakeModule({ name: 'module3', moduleOrder: 3 }))
		await addModule(makeFakeModule({ name: 'module4', moduleOrder: 4 }))
		const module5 = await addModule(
			makeFakeModule({ name: 'module5', moduleOrder: 5 })
		)
		await addModule(makeFakeModule({ name: 'module6', moduleOrder: 6 }))

		const result = await moveModuleOrder(module5._id, 2)
		expect(result.changed).toBe(4)
	})

	it('does not change anything if a module is not found', async () => {
		const result = await moveModuleOrder('61a6ddbc45ffa105ef4b34b3', 1)
		expect(result.changed).toBe(0)
	})

	it('rejects if `id` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await moveModuleOrder()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('rejects if `newOrder` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await moveModuleOrder('61a6ddbc45ffa105ef4b34b3')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})
})
