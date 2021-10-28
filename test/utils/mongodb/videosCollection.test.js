const videosCollection = require('../../../utils/mongodb/videosCollection')

const conn = require('../../../utils/mongodb/dbConnection')
const Video = conn.models.Video
require('dotenv').config({ path: '.env' })

beforeAll(async () => {
	await conn.openUri(process.env.DB_TEST)
	await Video.deleteMany()
})

beforeEach(async () => {
	await Video({
		_id: '6179b4bc8d93ac11053c33fa',
		fieldname: 'video',
		originalname: 'video2.mp4',
		encoding: '7bit',
		mimetype: 'video/mp4',
		destination: 'uploads/',
		filename: 'video2.mp4',
		path: 'uploads\\video2.mp4',
		size: 8443873,
	}).save()
	await Video({
		_id: '6179b4ce4bc4621e9537853f',
		fieldname: 'video',
		originalname: 'video1.mp4',
		encoding: '7bit',
		mimetype: 'video/mp4',
		destination: 'uploads/',
		filename: 'video1.mp4',
		path: 'uploads\\video1.mp4',
		size: 8443873,
	}).save()
})

afterEach(async () => {
	await Video.deleteMany()
})

afterAll(() => {
	conn.close()
})

describe('createNewVideo', () => {
	it('should resolve when a course is successfully created', async () => {
		doc = {
			fieldname: 'video',
			originalname: 'video3.mp4',
			encoding: '7bit',
			mimetype: 'video/mp4',
			destination: 'uploads/',
			filename: 'video3.mp4',
			path: 'uploads\\video3.mp4',
			size: 8443873,
		}
		const data = await videosCollection.createNewVideo(doc)
		return data
	})

	it('should reject when a doc does not have the required fields', async () => {
		doc = {
			fieldname: 'video',
			originalname: 'video3.mp4',
			encoding: '7bit',
			mimetype: 'video/mp4',
		}
		await expect(videosCollection.createNewVideo(doc)).rejects.toEqual({
			error:
				'ValidationError: size: Path `size` is required., path: Path `path` is required., filename: Path `filename` is required., destination: Path `destination` is required.',
		})
	})

	it('should reject when a doc is not passed', async () => {
		await expect(videosCollection.createNewVideo()).rejects.toEqual({
			error: 'doc must be included',
		})
	})
})

describe('getAllVideos', () => {
	it('should resolve a query for all videos in the database', async () => {
		await expect(videosCollection.getAllVideos()).resolves
	})

	it('should query all videos in the database successfully', async () => {
		let doc = await videosCollection.getAllVideos()
		doc.forEach((ele) => {
			delete ele.__v
			delete ele._id
			delete ele.createdAt
			delete ele.updatedAt
		})
		expect(doc).toMatchObject([
			{
				destination: 'uploads/',
				encoding: '7bit',
				fieldname: 'video',
				filename: 'video2.mp4',
				mimetype: 'video/mp4',
				originalname: 'video2.mp4',
				path: 'uploads\\video2.mp4',
				size: 8443873,
			},
			{
				destination: 'uploads/',
				encoding: '7bit',
				fieldname: 'video',
				filename: 'video1.mp4',
				mimetype: 'video/mp4',
				originalname: 'video1.mp4',
				path: 'uploads\\video1.mp4',
				size: 8443873,
			},
		])
	})
})

describe('getVideoById', () => {
	it('should resolve if the query was successful', async () => {
		await expect(videosCollection.getVideoById('6179b4bc8d93ac11053c33fa'))
			.resolves
	})

	it('should query the correct video document on a successful query', async () => {
		let doc = await videosCollection.getVideoById('6179b4bc8d93ac11053c33fa')

		doc = {
			_id: doc._id.toString(),
			destination: doc.destination,
			encoding: doc.encoding,
			fieldname: doc.fieldname,
			filename: doc.filename,
			mimetype: doc.mimetype,
			originalname: doc.originalname,
			path: doc.path,
			size: doc.size,
		}

		expect(doc).toMatchObject({
			_id: '6179b4bc8d93ac11053c33fa',
			destination: 'uploads/',
			encoding: '7bit',
			fieldname: 'video',
			filename: 'video2.mp4',
			mimetype: 'video/mp4',
			originalname: 'video2.mp4',
			path: 'uploads\\video2.mp4',
			size: 8443873,
		})
	})

	it('should reject if there is no video to query', async () => {
		await expect(
			videosCollection.getVideoById('6179b4ce4bc4621e95378531')
		).rejects.toEqual({
			error: 'Error: Video with id 6179b4ce4bc4621e95378531 not found',
		})
	})
})

describe('deleteVideoById', () => {
	it('should resolve when a video is deleted', async () => {
		let doc = await videosCollection.deleteVideoById('6179b4bc8d93ac11053c33fa')
		doc = {
			destination: doc.destination,
			encoding: doc.encoding,
			fieldname: doc.fieldname,
			filename: doc.filename,
			mimetype: doc.mimetype,
			originalname: doc.originalname,
			path: doc.path,
			size: doc.size,
		}
		expect(doc).toEqual({
			destination: 'uploads/',
			encoding: '7bit',
			fieldname: 'video',
			filename: 'video2.mp4',
			mimetype: 'video/mp4',
			originalname: 'video2.mp4',
			path: 'uploads\\video2.mp4',
			size: 8443873,
		})
	})

	it('should reject when a video cannot be found to be deleted', async () => {
		await expect(
			videosCollection.deleteVideoById('6179b4ce4bc4621e95378537')
		).rejects.toEqual({
			error: 'Error: Video with id 6179b4ce4bc4621e95378537 not found',
		})
	})
})
