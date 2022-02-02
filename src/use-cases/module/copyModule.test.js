const Module = require('../../database/models/module.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')
const makeCopyModule = require('./copyModule')

describe('copyModule Test Suite', () => {
	const addModule = makeAddModule({ Module })
	const copyModule = makeCopyModule({ Module })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully copies a module', async () => {
		const module = await addModule(makeFakeModule())

		const bindSectionId = '61f9fadbef472bd26d0e684f'
		const copy = await copyModule(module._id, bindSectionId)
		expect(copy._id).not.toBe(module._id)
		expect(copy.sectionId).not.toBe(module.sectionId)
		expect({
			name: copy.name,
			isPublished: copy.isPublished,
			moduleOrder: copy.moduleOrder,
			dropDate: copy.dropDate,
		}).toEqual({
			name: module.name,
			isPublished: module.isPublished,
			moduleOrder: module.moduleOrder,
			dropDate: module.dropDate,
		})
	})

	it('fails to copy if cannot find the module', async () => {
		let errorName = 'nothing'
		try {
			await copyModule('61f9c07a5b333683766bae70')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fails to copy if invalid id', async () => {
		let errorName = 'nothing'
		try {
			await copyModule('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})

	// it('fails to add a module that does not have valid properties', async () => {
	// 	let errorName = 'nothing'
	// 	try {
	// 		await addModule(makeFakeModule({ name: '' }))
	// 	} catch (error) {
	// 		errorName = error.name
	// 	}
	// 	expect(errorName).toBe('ValidationError')
	// })
})
