const Content = require('../../database/models/content.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')
const makeCollapseContents = require('./collapseContents')

describe('findAllContents Test Suite', () => {
	const addContent = makeAddContent({ Content })
	const collapseContents = makeCollapseContents({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully orders the contentOrder in contents docs to start at 1, remove duplicates, and be sequenctial', async () => {
		await addContent(makeFakeContent({ name: 'content1', contentOrder: 4 }))
		await addContent(makeFakeContent({ name: 'content2', contentOrder: 5 }))
		await addContent(makeFakeContent({ name: 'content3', contentOrder: 7 }))
		await addContent(makeFakeContent({ name: 'content4', contentOrder: 10 }))
		await addContent(makeFakeContent({ name: 'content5', contentOrder: 11 }))

		const { moduleId } = makeFakeContent()
		const collapsed = await collapseContents(moduleId)

		for (let i = 1; i <= 5; i++) {
			const index = i - 1
			// Check orders are 1 through 5
			expect(collapsed.contents[index].contentOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.contents[index].name).toBe(`content${i}`)
		}
	})

	it('rejects if no `moduleId` is provided', async () => {
		let errorName = 'nothing'
		try {
			await collapseContents()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fixes 2 duplicates `contentOrder` entries', async () => {
		await addContent(makeFakeContent({ name: 'content1', contentOrder: 3 }))
		await addContent(makeFakeContent({ name: 'content2', contentOrder: 3 }))

		const { moduleId } = makeFakeContent()
		const collapsed = await collapseContents(moduleId)

		for (let i = 1; i <= 2; i++) {
			const index = i - 1
			// Check orders are 1 through 2
			expect(collapsed.contents[index].contentOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.contents[index].name).toBe(`content${i}`)
		}
	})

	it('fixes 4 duplicates `contentOrder` entries', async () => {
		await addContent(makeFakeContent({ name: 'content1', contentOrder: 3 }))
		await addContent(makeFakeContent({ name: 'content2', contentOrder: 3 }))
		await addContent(makeFakeContent({ name: 'content3', contentOrder: 3 }))
		await addContent(makeFakeContent({ name: 'content4', contentOrder: 3 }))

		const { moduleId } = makeFakeContent()
		const collapsed = await collapseContents(moduleId)

		for (let i = 1; i <= 4; i++) {
			const index = i - 1
			// Check orders are 1 through 4
			expect(collapsed.contents[index].contentOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.contents[index].name).toBe(`content${i}`)
		}
	})

	it('does a simple modify if there is only 1 content to sort', async () => {
		await addContent(makeFakeContent({ name: 'content1', contentOrder: 3 }))

		const { moduleId } = makeFakeContent()
		const collapsed = await collapseContents(moduleId)
		expect(collapsed.contents[0].contentOrder).toBe(1)
		expect(collapsed.contents[0].name).toBe('content1')
	})

	it('is successful when there is nothing to modify', async () => {
		const { moduleId } = makeFakeContent()
		const collapsed = await collapseContents(moduleId)
		expect(collapsed.contents).toEqual([])
	})

	// it('returns found of 0 if no contents are found', async () => {
	// 	const results = await findAllContents('61a55df0eb19b75ef3139471')
	// 	expect(results).toMatchObject({ found: 0, contents: [] })
	// })

	// it('rejects if no moduleId is provided', async () => {
	// 	let errorMessage = 'nothing'
	// 	try {
	// 		await findAllContents()
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
