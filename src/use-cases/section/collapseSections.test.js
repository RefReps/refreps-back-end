const Section = require('../../database/models/section.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeCollapseSections = require('./collapseSections')

describe('findAllSections Test Suite', () => {
	const addSection = makeAddSection({ Section })
	const collapseSections = makeCollapseSections({ Section })

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
			makeFakeSection({ name: 'section1', sectionOrder: 4 })
		)
		const section2 = await addSection(
			makeFakeSection({ name: 'section2', sectionOrder: 5 })
		)
		const section3 = await addSection(
			makeFakeSection({ name: 'section3', sectionOrder: 7 })
		)
		const section4 = await addSection(
			makeFakeSection({ name: 'section4', sectionOrder: 10 })
		)
		const section5 = await addSection(
			makeFakeSection({ name: 'section5', sectionOrder: 11 })
		)

		const { courseId } = makeFakeSection()
		const foundSections = await collapseSections(courseId)
		console.log(foundSections)

		for (let i = 1; i <= 5; i++) {
			expect(foundSections.sections[i - 1].sectionOrder).toBe(i)
		}
	})

	// it('returns found of 0 if no sections are found', async () => {
	// 	const results = await findAllSections('61a55df0eb19b75ef3139471')
	// 	expect(results).toMatchObject({ found: 0, sections: [] })
	// })

	// it('rejects if no courseId is provided', async () => {
	// 	let errorMessage = 'nothing'
	// 	try {
	// 		await findAllSections()
	// 	} catch (error) {
	// 		errorMessage = error.message
	// 	}
	// 	expect(errorMessage).toBe('courseId is undefined')
	// })

	// it('includes non published courses if specified', async () => {
	// 	await addCourse(makeFakeCourse({ isPublished: false }))
	// 	await addCourse(makeFakeCourse({ isPublished: true }))

	// 	const resultsPublishedOnly = await findAllCourses({ publishedOnly: true })
	// 	expect(resultsPublishedOnly.found).toBe(1)

	// 	const resultsNonPublished = await findAllCourses({ publishedOnly: false })
	// 	expect(resultsNonPublished.found).toBe(2)
	// })
})
