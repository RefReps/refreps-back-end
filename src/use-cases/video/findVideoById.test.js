const Video = require('../../database/models/video.model')
const { makeFakeVideo } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddVideo = require('./addVideo')
const makeFindVideoById = require('./findVideoById')

describe('findVideoById Test Suite', () => {
	const addVideo = makeAddVideo({ Video })
	const findVideoById = makeFindVideoById({ Video })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Video.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully finds a video by id', async () => {
		const video1 = await addVideo(makeFakeVideo({ name: 'video1' }))

		const found = await findVideoById(video1._id)
		expect(found).toMatchObject(video1)
	})

	it('finds the right video given multiple entries', async () => {
		const video1 = await addVideo(makeFakeVideo({ name: 'video1' }))
		const video2 = await addVideo(makeFakeVideo({ name: 'video2' }))
		const video3 = await addVideo(makeFakeVideo({ name: 'video3' }))

		const found = await findVideoById(video2._id)
		expect(found).toMatchObject(video2)
	})

	it('rejects if the video is in the db', async () => {
		let errorName = 'nothing'
		try {
			await findVideoById('61ab73a461986c851ecf82a2')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('CastError when the id is not an ObjectId', async () => {
		let errorName = 'nothing'
		try {
			await findVideoById('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})
})
