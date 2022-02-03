const QuizMock = require('../../../__test__/fixtures/Quiz')
const QuizJsonMock = require('../../../__test__/fixtures/QuizJson')
const { makeFakeQuestion } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeDeleteQuestion = require('./deleteQuestion')

describe.skip('deleteQuestion Test Suite', () => {
	const deleteQuestion = makeDeleteQuestion({
		Quiz: QuizMock,
		QuizJson: QuizJsonMock,
	})

	beforeAll(async () => {})

	beforeEach(async () => {})

	afterAll(async () => {})

	it('successfully deletes a question by id', async () => {
		const deleted = await deleteQuestion(question1._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('successfully deletes given multiple entries in the db', async () => {
		const deleted = await deleteQuestion(question2._id)
		expect(deleted).toMatchObject({
			deleted: 1,
		})
	})

	it('fails to delete a question if it is not in the db', async () => {
		await expect(deleteQuestion('619bc8c5b0bcf8a50744f2ba')).rejects.toEqual({
			deleted: 0,
		})
	})

	it('fails to delete a question if a bad id is parsed', async () => {
		let errorMessage = 'nothing'
		try {
			await deleteQuestion('bad id')
		} catch (error) {
			errorMessage = error.message
		}
		expect(errorMessage).toBe(
			'Cast to ObjectId failed for value "bad id" (type string) at path "_id" for model "Question"'
		)
	})
})
