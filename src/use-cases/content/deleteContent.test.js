const Content = require('../../database/models/content.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')
const makeDeleteContent = require('./deleteContent')

describe('deleteContent Test Suite', () => {
	const addContent = makeAddContent({ Content })
	const deleteContent = makeDeleteContent({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully deletes a content by id', async () => {
		const content1 = await addContent(makeFakeContent({ name: 'content1' }))

		const deleted = await deleteContent(content1._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('successfully deletes given multiple entries in the db', async () => {
		const content1 = await addContent(makeFakeContent({ name: 'content1' }))
		const content2 = await addContent(makeFakeContent({ name: 'content2' }))
		const content3 = await addContent(makeFakeContent({ name: 'content3' }))

		const deleted = await deleteContent(content2._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('fails to delete a content if it is not in the db', async () => {
		await expect(deleteContent('619bc8c5b0bcf8a50744f2ba')).rejects.toEqual({
			deleted: 0,
		})
	})

	it('fails to delete a content if a bad id is parsed', async () => {
		let errorMessage = 'nothing'
		try {
			await deleteContent('bad id')
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Cast to ObjectId failed for value "bad id" (type string) at path "_id" for model "Content"'
		)
	})
})
