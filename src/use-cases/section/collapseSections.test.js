const Section = require('../../database/models/section.model')
const Course = require('../../database/models/course.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeCollapseSections = require('./collapseSections')

describe('findAllSections Test Suite', () => {
	const addSection = makeAddSection({ Section, Course })
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

	it('successfully orders the sectionOrder in sections docs to start at 1, remove duplicates, and be sequenctial', async () => {
		await addSection(makeFakeSection({ name: 'section1', sectionOrder: 4 }))
		await addSection(makeFakeSection({ name: 'section2', sectionOrder: 5 }))
		await addSection(makeFakeSection({ name: 'section3', sectionOrder: 7 }))
		await addSection(makeFakeSection({ name: 'section4', sectionOrder: 10 }))
		await addSection(makeFakeSection({ name: 'section5', sectionOrder: 11 }))

		const { courseId } = makeFakeSection()
		const collapsed = await collapseSections(courseId)

		for (let i = 1; i <= 5; i++) {
			const index = i - 1
			// Check orders are 1 through 5
			expect(collapsed.sections[index].sectionOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.sections[index].name).toBe(`section${i}`)
		}
	})

	it('rejects if no `courseId` is provided', async () => {
		let errorName = 'nothing'
		try {
			await collapseSections()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fixes 2 duplicates `sectionOrder` entries', async () => {
		await addSection(makeFakeSection({ name: 'section1', sectionOrder: 3 }))
		await addSection(makeFakeSection({ name: 'section2', sectionOrder: 3 }))

		const { courseId } = makeFakeSection()
		const collapsed = await collapseSections(courseId)

		for (let i = 1; i <= 2; i++) {
			const index = i - 1
			// Check orders are 1 through 2
			expect(collapsed.sections[index].sectionOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.sections[index].name).toBe(`section${i}`)
		}
	})

	it('fixes 4 duplicates `sectionOrder` entries', async () => {
		await addSection(makeFakeSection({ name: 'section1', sectionOrder: 3 }))
		await addSection(makeFakeSection({ name: 'section2', sectionOrder: 3 }))
		await addSection(makeFakeSection({ name: 'section3', sectionOrder: 3 }))
		await addSection(makeFakeSection({ name: 'section4', sectionOrder: 3 }))

		const { courseId } = makeFakeSection()
		const collapsed = await collapseSections(courseId)

		for (let i = 1; i <= 4; i++) {
			const index = i - 1
			// Check orders are 1 through 4
			expect(collapsed.sections[index].sectionOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.sections[index].name).toBe(`section${i}`)
		}
	})

	it('does a simple modify if there is only 1 section to sort', async () => {
		await addSection(makeFakeSection({ name: 'section1', sectionOrder: 3 }))

		const { courseId } = makeFakeSection()
		const collapsed = await collapseSections(courseId)
		expect(collapsed.sections[0].sectionOrder).toBe(1)
		expect(collapsed.sections[0].name).toBe('section1')
	})

	it('is successful when there is nothing to modify', async () => {
		const { courseId } = makeFakeSection()
		const collapsed = await collapseSections(courseId)
		expect(collapsed.sections).toEqual([])
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
