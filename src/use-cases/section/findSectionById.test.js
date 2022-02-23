const Section = require('../../database/models/section.model')
const Course = require('../../database/models/course.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeFindSectionById = require('./findSectionById')

describe('findSectionById Test Suite', () => {
	const addSection = makeAddSection({ Section, Course })
	const findSectionById = makeFindSectionById({ Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds a section by id', async () => {
		const section1 = await addSection(makeFakeSection({ name: 'section1' }))

		const found = await findSectionById(section1._id)
		expect(found).toMatchObject(section1)
	})

	it('finds the right section given multiple entries', async () => {
		const section1 = await addSection(makeFakeSection({ name: 'section1' }))
		const section2 = await addSection(makeFakeSection({ name: 'section2' }))
		const section3 = await addSection(makeFakeSection({ name: 'section3' }))

		const found = await findSectionById(section2._id)
		expect(found).toMatchObject(section2)
	})

	it('successfully finds 0 when the section is in the db', async () => {
		await expect(
			findSectionById('6197ae39ef8716d0dd181e08')
		).resolves.toMatchObject({})
	})

	it('CastError when the id is not an ObjectId', async () => {
		let errorName = 'nothing'
		try {
			await findSectionById('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})
})
