const Section = require('../../database/models/section.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeFindAllSections = require('./findAllSections')

describe('findAllSections Test Suite', () => {
	const addSection = makeAddSection({ Section })
	const findAllSections = makeFindAllSections({ Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds all sections within a course', async () => {
		const section1 = await addSection(
			makeFakeSection({ name: 'section1', sectionOrder: 1 })
		)
		const section2 = await addSection(
			makeFakeSection({ name: 'section2', sectionOrder: 2 })
		)
		const section3 = await addSection(
			makeFakeSection({ name: 'section3', sectionOrder: 3 })
		)
		const section4 = await addSection(
			makeFakeSection({ name: 'section4', sectionOrder: 4 })
		)
		const section5 = await addSection(
			makeFakeSection({ name: 'section5', sectionOrder: 5 })
		)
		const diffSection = await addSection(
			makeFakeSection({
				name: 'not included',
				courseId: '61a55df0eb19b75ef3139471',
			})
		)

		const { courseId } = makeFakeSection()
		const foundSections = await findAllSections(courseId)
		expect(foundSections.found).toBe(5)
		expect(foundSections.sections).toEqual([
			section1,
			section2,
			section3,
			section4,
			section5,
		])
	})

	it('returns found of 0 if no sections are found', async () => {
		const results = await findAllSections('61a55df0eb19b75ef3139471')
		expect(results).toMatchObject({ found: 0, sections: [] })
	})

	it('rejects if no courseId is provided', async () => {
		let errorMessage = 'nothing'
		try {
			await findAllSections()
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe('courseId is undefined')
	})

	it('includes non published courses if specified', async () => {
		await addSection(makeFakeSection({ isPublished: false }))
		await addSection(makeFakeSection({ isPublished: true }))

		const { courseId } = makeFakeSection()

		const resultsPublishedOnly = await findAllSections(courseId, {
			publishedOnly: true,
		})
		expect(resultsPublishedOnly.found).toBe(1)

		const resultsNonPublished = await findAllSections(courseId, {
			publishedOnly: false,
		})
		expect(resultsNonPublished.found).toBe(2)
	})
})
