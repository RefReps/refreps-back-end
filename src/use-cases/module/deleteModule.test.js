const Module = require('../../database/models/module.model')
const Section = require('../../database/models/section.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')
const makeDeleteModule = require('./deleteModule')

describe('deleteModule Test Suite', () => {
	const addModule = makeAddModule({ Module, Section })
	const deleteModule = makeDeleteModule({ Module, Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully deletes a module by id', async () => {
		const module1 = await addModule(makeFakeModule({ name: 'module1' }))

		const deleted = await deleteModule(module1._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('successfully deletes given multiple entries in the db', async () => {
		const module1 = await addModule(makeFakeModule({ name: 'module1' }))
		const module2 = await addModule(makeFakeModule({ name: 'module2' }))
		const module3 = await addModule(makeFakeModule({ name: 'module3' }))

		const deleted = await deleteModule(module2._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('fails to delete a module if it is not in the db', async () => {
		await expect(deleteModule('619bc8c5b0bcf8a50744f2ba')).rejects.toEqual({
			deleted: 0,
		})
	})

	it('fails to delete a module if a bad id is parsed', async () => {
		let errorMessage = 'nothing'
		try {
			await deleteModule('bad id')
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Cast to ObjectId failed for value "bad id" (type string) at path "_id" for model "Module"'
		)
	})
})
