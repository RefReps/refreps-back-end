const Section = require('../../database/models/section.model')
const Course = require('../../database/models/course.model')
const { makeFakeSection } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddSection = require('./addSection')
const makeDeleteSection = require('./deleteSection')

describe('deleteSection Test Suite', () => {
	const addSection = makeAddSection({ Section, Course })
	const deleteSection = makeDeleteSection({ Section, Course })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Section.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully deletes a section by id', async () => {
		const section1 = await addSection(makeFakeSection({ name: 'section1' }))

		const deleted = await deleteSection(section1._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('successfully deletes given multiple entries in the db', async () => {
		const section1 = await addSection(makeFakeSection({ name: 'section1' }))
		const section2 = await addSection(makeFakeSection({ name: 'section2' }))
		const section3 = await addSection(makeFakeSection({ name: 'section3' }))

		const deleted = await deleteSection(section2._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('fails to delete a section if it is not in the db', async () => {
		await expect(deleteSection('619bc8c5b0bcf8a50744f2ba')).rejects.toEqual({
			deleted: 0,
		})
	})

	it('fails to delete a section if a bad id is parsed', async () => {
		let errorMessage = 'nothing'
		try {
			await deleteSection('bad id')
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Cast to ObjectId failed for value "bad id" (type string) at path "_id" for model "Section"'
		)
	})
})
