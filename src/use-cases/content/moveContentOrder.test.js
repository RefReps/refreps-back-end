const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')
const makeMoveContentOrder = require('./moveContentOrder')

describe('moveContentOrder Test Suite', () => {
	const addContent = makeAddContent({ Content, Module })
	const moveContentOrder = makeMoveContentOrder({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('changes nothing when the new order is the old order', async () => {
		const content1 = await addContent(
			makeFakeContent({ name: 'content1', contentOrder: 1 })
		)

		const result = await moveContentOrder(content1._id, 1)
		expect(result.changed).toBe(0)
	})

	it('changes the order of the first element going to the last', async () => {
		const content1 = await addContent(
			makeFakeContent({ name: 'content1', contentOrder: 1 })
		)
		await addContent(makeFakeContent({ name: 'content2', contentOrder: 2 }))
		await addContent(makeFakeContent({ name: 'content3', contentOrder: 3 }))
		await addContent(makeFakeContent({ name: 'content4', contentOrder: 4 }))

		const result = await moveContentOrder(content1._id, 4)
		expect(result.changed).toBe(4)
	})

	it('changes the order of the last element to the first element', async () => {
		await addContent(makeFakeContent({ name: 'content1', contentOrder: 1 }))
		await addContent(makeFakeContent({ name: 'content2', contentOrder: 2 }))
		await addContent(makeFakeContent({ name: 'content3', contentOrder: 3 }))
		const content4 = await addContent(
			makeFakeContent({ name: 'content4', contentOrder: 4 })
		)

		const result = await moveContentOrder(content4._id, 1)
		expect(result.changed).toBe(4)
	})

	it('changes the order of a middle element to 2 elements after', async () => {
		await addContent(makeFakeContent({ name: 'content1', contentOrder: 1 }))
		const content2 = await addContent(
			makeFakeContent({ name: 'content2', contentOrder: 2 })
		)
		await addContent(makeFakeContent({ name: 'content3', contentOrder: 3 }))
		await addContent(makeFakeContent({ name: 'content4', contentOrder: 4 }))
		await addContent(makeFakeContent({ name: 'content5', contentOrder: 5 }))
		await addContent(makeFakeContent({ name: 'content6', contentOrder: 6 }))

		const result = await moveContentOrder(content2._id, 5)
		expect(result.changed).toBe(4)
	})

	it('changes the order of a middle element to 2 elements prior', async () => {
		await addContent(makeFakeContent({ name: 'content1', contentOrder: 1 }))
		await addContent(makeFakeContent({ name: 'content2', contentOrder: 2 }))
		await addContent(makeFakeContent({ name: 'content3', contentOrder: 3 }))
		await addContent(makeFakeContent({ name: 'content4', contentOrder: 4 }))
		const content5 = await addContent(
			makeFakeContent({ name: 'content5', contentOrder: 5 })
		)
		await addContent(makeFakeContent({ name: 'content6', contentOrder: 6 }))

		const result = await moveContentOrder(content5._id, 2)
		expect(result.changed).toBe(4)
	})

	it('does not change anything if a content is not found', async () => {
		const result = await moveContentOrder('61a6ddbc45ffa105ef4b34b3', 1)
		expect(result.changed).toBe(0)
	})

	it('rejects if `id` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await moveContentOrder()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('rejects if `newOrder` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await moveContentOrder('61a6ddbc45ffa105ef4b34b3')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})
})
