const Section = require('../../database/models/section.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeCopySection = require('./copySection')

describe('copySection Test Suite', () => {
	const addSection = makeAddSection({ Section })
	const copySection = makeCopySection({ Section })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully copies a section', async () => {
		const section = await addSection(makeFakeSection())

		const bindCourseId = '61f9fadbef472bd26d0e684f'
		const copy = await copySection(section._id, bindCourseId)
		expect(copy._id).not.toBe(section._id)
		expect(copy.courseId).not.toBe(section.courseId)
		expect({
			name: copy.name,
			isPublished: copy.isPublished,
			sectionOrder: copy.sectionOrder,
			dropDate: copy.dropDate,
		}).toEqual({
			name: section.name,
			toDocument: section.toDocument,
			isPublished: section.isPublished,
			sectionOrder: section.sectionOrder,
			dropDate: section.dropDate,
		})
	})

	it('fails to copy if cannot find the section', async () => {
		let errorName = 'nothing'
		try {
			await copySection('61f9c07a5b333683766bae70')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fails to copy if invalid id', async () => {
		let errorName = 'nothing'
		try {
			await copySection('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})

	// it('fails to add a section that does not have valid properties', async () => {
	// 	let errorName = 'nothing'
	// 	try {
	// 		await addSection(makeFakeSection({ name: '' }))
	// 	} catch (error) {
	// 		errorName = error.name
	// 	}
	// 	expect(errorName).toBe('ValidationError')
	// })
})
