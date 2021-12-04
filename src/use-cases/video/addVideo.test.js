const Video = require('../../database/models/video.model')
const { makeFakeVideo } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddVideo = require('./addVideo')

describe('addVideo Test Suite', () => {
	const addVideo = makeAddVideo({ Video })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Video.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully adds a video', async () => {
		addVideo(makeFakeVideo())
	})

	it('fails to add a video if not valid', async () => {
		let errorName = 'nothing'
		try {
			await addVideo(makeFakeVideo({ fieldname: '' }))
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})

	it('fails when no videoInfo is passed', async () => {
		let errorName = 'nothing'
		try {
			await addVideo()
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ValidationError')
	})
})
