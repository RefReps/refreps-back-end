const Section = require('../../database/models/section.model')
const Course = require('../../database/models/course.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')

describe('addSection Test Suite', () => {
	const addSection = makeAddSection({ Section, Course })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a section', async () => {
		const section = await addSection(makeFakeSection())
		expect(section.name).toBe(makeFakeSection().name)
	})

	it('fails to add section when required properties are not passed', async () => {
		let errorMessage = 'nothing'
		try {
			await addSection()
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Section validation failed: sectionOrder: Path `sectionOrder` is required., courseId: Path `courseId` is required., name: Path `name` is required.'
		)
	})

	it('fails to add a section that does not have valid properties', async () => {
		let errorMessage = 'nothing'
		try {
			await addSection(makeFakeSection({ name: '' }))
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Section validation failed: name: Path `name` is required.'
		)
	})
})
