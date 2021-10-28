const contentCollection = require('../../../utils/mongodb/contentCollection')

const conn = require('../../../utils/mongodb/dbConnection')
const Content = conn.models.Content
const { ObjectId } = require('mongoose').Types
require('dotenv').config({ path: '.env' })

beforeAll(async () => {
	await conn.openUri(process.env.DB_TEST)
	await Content.deleteMany()
})

beforeEach(async () => {
	await Content({
		_id: new ObjectId('6179f6b9ee1893be4eee2dd7'),
		contentName: 'Video 1',
		orderInModule: 1,
		contentType: 'Video',
		toContent: new ObjectId('6179e9b5a8644dbddad36888'),
		data: [],
	}).save()
	await Content({
		_id: new ObjectId('6179f6c3babe1c532e863999'),
		contentName: 'Quiz 1',
		orderInModule: 2,
		contentType: 'Quiz',
		toContent: new ObjectId('6179e9dde94aa4016f24c36a'),
		data: [],
	}).save()
})

afterEach(async () => {
	await Content.deleteMany()
})

afterAll(() => {
	conn.close()
})

describe('createNewContent', () => {
	it('should resolve when a content is successfully created', async () => {
		const doc = {
			contentName: 'Video 2',
			orderInModule: 3,
			contentType: 'Video',
			toContent: new ObjectId('6179ea66cc0efa015d682d1a'),
			data: [],
		}
		let data = await contentCollection.createNewContent(doc)
		data = {
			contentName: data.contentName,
			contentType: data.contentType,
			data: data.data,
			orderInModule: data.orderInModule,
			toContent: data.toContent.toString(),
		}
		expect(data).toMatchObject({
			contentName: 'Video 2',
			contentType: 'Video',
			data: [],
			orderInModule: 3,
			toContent: '6179ea66cc0efa015d682d1a',
		})
	})

	it('should reject when a doc does not have the required fields', async () => {
		await expect(contentCollection.createNewContent({})).rejects.toMatchObject({
			error: 'ValidationError: toContent: Path `toContent` is required.',
		})
	})

	it('should reject when a doc is not passed', async () => {
		await expect(contentCollection.createNewContent()).rejects.toMatchObject({
			error: 'doc must be included',
		})
	})
})

describe('getAllContent', () => {
	it('should resolve a query for all contents in the database', async () => {
		let data = await contentCollection.getAllContent()
		data = data.map((ele) => {
			return {
				contentName: ele.contentName,
				contentType: ele.contentType,
				data: ele.data,
				orderInModule: ele.orderInModule,
				toContent: ele.toContent.toString(),
			}
		})
		expect(data).toEqual([
			{
				contentName: 'Video 1',
				contentType: 'Video',
				data: [],
				orderInModule: 1,
				toContent: '6179e9b5a8644dbddad36888',
			},
			{
				contentName: 'Quiz 1',
				contentType: 'Quiz',
				data: [],
				orderInModule: 2,
				toContent: '6179e9dde94aa4016f24c36a',
			},
		])
	})
})

describe('getContentById', () => {
	it('should query the correct content document on a successful query', async () => {
		let doc = await contentCollection.getContentById('6179f6b9ee1893be4eee2dd7')
		doc = {
			contentName: doc.contentName,
			contentType: doc.contentType,
			data: doc.data,
			orderInModule: doc.orderInModule,
			toContent: doc.toContent.toString(),
		}
		expect(doc).toEqual({
			contentName: 'Video 1',
			contentType: 'Video',
			data: [],
			orderInModule: 1,
			toContent: '6179e9b5a8644dbddad36888',
		})
	})

	it('should reject if there is no content to query', async () => {
		await expect(
			contentCollection.getContentById('6179f6b9ee1893be4eee2dd1')
		).rejects.toEqual({
			error: 'Error: Content with id 6179f6b9ee1893be4eee2dd1 not found',
		})
	})
})

describe('updateContentById', () => {
	it('should resolve when a content is updated and the updated fields match the new document', async () => {
		const updateDoc = {
			contentName: 'Super Cool Video',
			orderInModule: 6,
			contentType: 'Video',
		}
		let updatedContent = await contentCollection.updateContentById(
			'6179f6c3babe1c532e863999',
			updateDoc
		)
		updatedContent = {
			contentName: updatedContent.contentName,
			contentType: updatedContent.contentType,
			data: updatedContent.data,
			orderInModule: updatedContent.orderInModule,
			toContent: updatedContent.toContent.toString(),
		}
		expect(updatedContent).toEqual({
			contentName: 'Super Cool Video',
			contentType: 'Video',
			data: [],
			orderInModule: 6,
			toContent: '6179e9dde94aa4016f24c36a',
		})
	})

	it('should reject when a content cannot be found to be updated', async () => {
		await expect(
			contentCollection.updateContentById('6179f6c3babe1c532e863997', {})
		).rejects.toEqual({
			error: 'Error: Content with id 6179f6c3babe1c532e863997 not found',
		})
	})

	it('should reject if no update is passed', async () => {
		await expect(
			contentCollection.updateContentById('6179f6c3babe1c532e863999')
		).rejects.toEqual({ error: 'update document must be passed' })
	})

	it('should reject if no contentId is passed', async () => {
		await expect(contentCollection.updateContentById()).rejects.toEqual({
			error: 'contendId must be passed',
		})
	})
})

describe('deleteContentById', () => {
	it('should resolve when a content is deleted', async () => {
		await expect(
			contentCollection.deleteContentById('6179f6c3babe1c532e863999')
		).resolves.toBeTruthy()
	})

	it('should reject when a content cannot be found to be deleted', async () => {
		await expect(
			contentCollection.deleteContentById('6179f6c3babe1c532e863997')
		).rejects.toEqual({
			error: 'Error: Content with id 6179f6c3babe1c532e863997 not found',
		})
	})

	it('should reject when no contentId is passed', async () => {
		await expect(contentCollection.deleteContentById()).rejects.toEqual({
			msg: 'contentId must be passed',
		})
	})
})
