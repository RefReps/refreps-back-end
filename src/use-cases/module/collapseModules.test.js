const Module = require('../../database/models/module.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddModule = require('./addModule')
const makeCollapseModules = require('./collapseModules')

describe('findAllModules Test Suite', () => {
	const addModule = makeAddModule({ Module })
	const collapseModules = makeCollapseModules({ Module })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Module.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully orders the moduleOrder in modules docs to start at 1, remove duplicates, and be sequenctial', async () => {
		await addModule(makeFakeModule({ name: 'module1', moduleOrder: 4 }))
		await addModule(makeFakeModule({ name: 'module2', moduleOrder: 5 }))
		await addModule(makeFakeModule({ name: 'module3', moduleOrder: 7 }))
		await addModule(makeFakeModule({ name: 'module4', moduleOrder: 10 }))
		await addModule(makeFakeModule({ name: 'module5', moduleOrder: 11 }))

		const { sectionId } = makeFakeModule()
		const collapsed = await collapseModules(sectionId)

		for (let i = 1; i <= 5; i++) {
			const index = i - 1
			// Check orders are 1 through 5
			expect(collapsed.modules[index].moduleOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.modules[index].name).toBe(`module${i}`)
		}
	})

	it('rejects if no `courseId` is provided', async () => {
		let errorName = 'nothing'
		try {
			await collapseModules()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fixes 2 duplicates `moduleOrder` entries', async () => {
		await addModule(makeFakeModule({ name: 'module1', moduleOrder: 3 }))
		await addModule(makeFakeModule({ name: 'module2', moduleOrder: 3 }))

		const { sectionId } = makeFakeModule()
		const collapsed = await collapseModules(sectionId)

		for (let i = 1; i <= 2; i++) {
			const index = i - 1
			// Check orders are 1 through 2
			expect(collapsed.modules[index].moduleOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.modules[index].name).toBe(`module${i}`)
		}
	})

	it('fixes 4 duplicates `moduleOrder` entries', async () => {
		await addModule(makeFakeModule({ name: 'module1', moduleOrder: 3 }))
		await addModule(makeFakeModule({ name: 'module2', moduleOrder: 3 }))
		await addModule(makeFakeModule({ name: 'module3', moduleOrder: 3 }))
		await addModule(makeFakeModule({ name: 'module4', moduleOrder: 3 }))

		const { sectionId } = makeFakeModule()
		const collapsed = await collapseModules(sectionId)

		for (let i = 1; i <= 4; i++) {
			const index = i - 1
			// Check orders are 1 through 4
			expect(collapsed.modules[index].moduleOrder).toBe(i)
			// Check the names are still in the correct order
			expect(collapsed.modules[index].name).toBe(`module${i}`)
		}
	})

	it('does a simple modify if there is only 1 module to sort', async () => {
		await addModule(makeFakeModule({ name: 'module1', moduleOrder: 3 }))

		const { sectionId } = makeFakeModule()
		const collapsed = await collapseModules(sectionId)
		expect(collapsed.modules[0].moduleOrder).toBe(1)
		expect(collapsed.modules[0].name).toBe('module1')
	})

	it('is successful when there is nothing to modify', async () => {
		const { sectionId } = makeFakeModule()
		const collapsed = await collapseModules(sectionId)
		expect(collapsed.modules).toEqual([])
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
