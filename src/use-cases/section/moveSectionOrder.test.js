const Section = require('../../database/models/section.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeMoveSectionOrder = require('./moveSectionOrder')

describe('moveSectionOrder Test Suite', () => {
	const addSection = makeAddSection({ Section })
	const moveSectionOrder = makeMoveSectionOrder({ Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('changes nothing when the new order is the old order', async () => {
		const section1 = await addSection(
			makeFakeSection({ name: 'section1', sectionOrder: 1 })
		)

		const result = await moveSectionOrder(section1._id, 1)
		expect(result.changed).toBe(0)
	})

	it('changes the order of the first element going to the last', async () => {
		const section1 = await addSection(
			makeFakeSection({ name: 'section1', sectionOrder: 1 })
		)
		await addSection(makeFakeSection({ name: 'section2', sectionOrder: 2 }))
		await addSection(makeFakeSection({ name: 'section3', sectionOrder: 3 }))
		await addSection(makeFakeSection({ name: 'section4', sectionOrder: 4 }))

		const result = await moveSectionOrder(section1._id, 4)
		expect(result.changed).toBe(4)
	})

	it('changes the order of the last element to the first element', async () => {
		await addSection(makeFakeSection({ name: 'section1', sectionOrder: 1 }))
		await addSection(makeFakeSection({ name: 'section2', sectionOrder: 2 }))
		await addSection(makeFakeSection({ name: 'section3', sectionOrder: 3 }))
		const section4 = await addSection(
			makeFakeSection({ name: 'section4', sectionOrder: 4 })
		)

		const result = await moveSectionOrder(section4._id, 1)
		expect(result.changed).toBe(4)
	})

	it('changes the order of a middle element to 2 elements after', async () => {
		await addSection(makeFakeSection({ name: 'section1', sectionOrder: 1 }))
		const section2 = await addSection(
			makeFakeSection({ name: 'section2', sectionOrder: 2 })
		)
		await addSection(makeFakeSection({ name: 'section3', sectionOrder: 3 }))
		await addSection(makeFakeSection({ name: 'section4', sectionOrder: 4 }))
		await addSection(makeFakeSection({ name: 'section5', sectionOrder: 5 }))
		await addSection(makeFakeSection({ name: 'section6', sectionOrder: 6 }))

		const result = await moveSectionOrder(section2._id, 5)
		expect(result.changed).toBe(4)
	})

	it('changes the order of a middle element to 2 elements prior', async () => {
		await addSection(makeFakeSection({ name: 'section1', sectionOrder: 1 }))
		await addSection(makeFakeSection({ name: 'section2', sectionOrder: 2 }))
		await addSection(makeFakeSection({ name: 'section3', sectionOrder: 3 }))
		await addSection(makeFakeSection({ name: 'section4', sectionOrder: 4 }))
		const section5 = await addSection(
			makeFakeSection({ name: 'section5', sectionOrder: 5 })
		)
		await addSection(makeFakeSection({ name: 'section6', sectionOrder: 6 }))

		const result = await moveSectionOrder(section5._id, 2)
		expect(result.changed).toBe(4)
	})

	it('does not change anything if a section is not found', async () => {
		const result = await moveSectionOrder('61a6ddbc45ffa105ef4b34b3', 1)
		expect(result.changed).toBe(0)
	})

	it('rejects if `id` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await moveSectionOrder()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('rejects if `newOrder` is not provided', async () => {
		let errorName = 'nothing'
		try {
			await moveSectionOrder('61a6ddbc45ffa105ef4b34b3')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})
})
