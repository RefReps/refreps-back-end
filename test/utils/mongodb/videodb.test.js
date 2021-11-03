const conn = require('../../../utils/mongodb/dbConnection')
const videodb = require('../../../utils/mongodb/videodb')
require('dotenv').config({ path: '.env' })

const test_db_uri = process.env.DB_TEST

beforeAll(async () => {
	await conn.openUri(test_db_uri)
	await conn.models.Video.deleteMany()
})

beforeEach(async () => {
	await conn.models
		.Video({
			fieldname: 'video',
			originalname: 'videoName1.mp4',
			encoding: '7bit',
			mimetype: 'video/mp4',
			destination: 'uploads/',
			filename: 'de7876b6-9370-421b-bae5-d8d488c90792-videoName1.mp4',
			path: 'uploads\\de7876b6-9370-421b-bae5-d8d488c90792-videoName1.mp4',
			size: 8443873,
			_id: '6181b243f8080c2a37fd20b6',
		})
		.save()
})

afterEach(async () => {
	await conn.models.Video.deleteMany()
})

afterAll(() => {
	conn.close()
})

describe('saveNewVideo', () => {
	it('should resolve the video on a successful save', async () => {
		let doc = {
			fieldname: 'video',
			originalname: 'videoName5.mp4',
			encoding: '7bit',
			mimetype: 'video/mp4',
			destination: 'uploads/',
			filename: 'de7876b6-9370-421b-bae5-d8d488c90792-videoName5.mp4',
			path: 'uploads\\de7876b6-9370-421b-bae5-d8d488c90792-videoName5.mp4',
			size: 8443873,
		}
		let videoDoc = await videodb.saveNewVideo(doc)
		let videoObject = videoDoc.toObject()
		delete videoObject.__v
		delete videoObject._id
		delete videoObject.createdAt
		delete videoObject.updatedAt

		expect(videoObject).toEqual({
			destination: 'uploads/',
			encoding: '7bit',
			fieldname: 'video',
			filename: 'de7876b6-9370-421b-bae5-d8d488c90792-videoName5.mp4',
			mimetype: 'video/mp4',
			originalname: 'videoName5.mp4',
			path: 'uploads\\de7876b6-9370-421b-bae5-d8d488c90792-videoName5.mp4',
			size: 8443873,
		})
	})

	it('should reject when required fields are missing', async () => {
		let doc = {}
		await expect(videodb.saveNewVideo(doc)).rejects.toThrow(
			'Video validation failed: size: Path `size` is required., path: Path `path` is required., filename: Path `filename` is required., destination: Path `destination` is required., mimetype: Path `mimetype` is required., encoding: Path `encoding` is required., originalname: Path `originalname` is required., fieldname: Path `fieldname` is required.'
		)
	})
})

describe('getAllVideos', () => {
	it('should resolve all videos documents in the db', async () => {
		let videoDocs = await videodb.getAllVideos()
		let videoObjects = []
		for (let index = 0; index < videoDocs.length; index++) {
			videoObjects.push(videoDocs[index].toObject())
		}

		videoObjects.forEach((ele) => {
			delete ele.__v
			delete ele._id
			delete ele.updatedAt
			delete ele.createdAt
		})

		expect(videoObjects).toMatchObject([
			{
				destination: 'uploads/',
				encoding: '7bit',
				fieldname: 'video',
				filename: 'de7876b6-9370-421b-bae5-d8d488c90792-videoName1.mp4',
				mimetype: 'video/mp4',
				originalname: 'videoName1.mp4',
				path: 'uploads\\de7876b6-9370-421b-bae5-d8d488c90792-videoName1.mp4',
				size: 8443873,
			},
		])
	})
})
