const conn = require('../../../utils/mongodb/dbConnection')
const { ObjectId } = require('mongoose').Types
const crudOperations = require('../../../utils/mongodb/crudOperations')
require('dotenv').config({ path: '.env' })

const test_uri = process.env.DB_TEST

beforeAll(async () => {
	await conn.openUri(test_uri)
	await conn.dropDatabase()
})

beforeEach(async () => {
	await conn.models
		.Course({
			_id: ObjectId('61805c2637afc2998b138b41'),
			courseName: 'Course 1',
			isTemplateCourse: true,
			settings: null,
			authors: [],
			students: [],
			sections: [],
		})
		.save()
	await conn.models
		.Course({
			_id: ObjectId('61805c2637afc2998b138b42'),
			courseName: 'Course 2',
			isTemplateCourse: false,
			settings: null,
			authors: [],
			students: [],
			sections: [
				{
					sectionName: 'Section 1',
					orderInCourse: -1,
					isViewable: false,
					_id: ObjectId('61805cb137afc2998b138b4d'),
					modules: [],
				},
				{
					sectionName: 'Section 2',
					orderInCourse: -1,
					isViewable: false,
					_id: ObjectId('61805cb137afc2998b138b4e'),
					modules: [
						{
							moduleName: 'Module 1',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							_id: ObjectId('61805ee237afc2998b138b76'),
						},
						{
							moduleName: 'Module 2',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							_id: ObjectId('61805ee237afc2998b138b77'),
						},
					],
				},
			],
		})
		.save()
	await conn.models
		.Course({
			_id: ObjectId('61805c2637afc2998b138b44'),
			courseName: 'Course 2',
			isTemplateCourse: false,
			settings: null,
			authors: [],
			students: [],
			sections: [
				{
					sectionName: 'Section 1',
					orderInCourse: -1,
					isViewable: false,
					_id: ObjectId('61805cb137afc2998b138b51'),
					modules: [],
				},
				{
					sectionName: 'Section 2',
					orderInCourse: -1,
					isViewable: false,
					_id: ObjectId('61805cb137afc2998b138b52'),
					modules: [
						{
							moduleName: 'Module 1',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							content: [],
							_id: ObjectId('61805ee237afc2998b138b53'),
						},
						{
							moduleName: 'Module 2',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							content: [
								{
									contentName: 'Content 1',
									orderInModule: 0,
									toContent: ObjectId('61805ee237afc2998b138b61'),
									onModel: 'Video',
									data: [],
									_id: ObjectId('61805ee237afc2998b138b71'),
								},
								{
									contentName: 'Content 2',
									orderInModule: 1,
									toContent: ObjectId('61805ee237afc2998b138b61'),
									onModel: 'Video',
									data: [],
									_id: ObjectId('61805ee237afc2998b138b72'),
								},
							],
							_id: ObjectId('61805ee237afc2998b138b54'),
						},
					],
				},
			],
		})
		.save()
	await conn.models
		.Video({
			_id: ObjectId('61805ee237afc2998b138550'),
			fieldname: 'video',
			originalname: 'Video1.mp4',
			encoding: '7bit',
			mimetype: 'video/mp4',
			destination: 'uploads/',
			filename: 'Video1.mp4',
			path: 'uploads\\Video1.mp4',
			size: 8443873,
		})
		.save()
	await conn.models
		.Video({
			_id: ObjectId('61805ee237afc2998b138551'),
			fieldname: 'video',
			originalname: 'Video2.mp4',
			encoding: '7bit',
			mimetype: 'video/mp4',
			destination: 'uploads/',
			filename: 'Video2.mp4',
			path: 'uploads\\Video2.mp4',
			size: 8443873,
		})
		.save()
})

afterEach(async () => {
	await conn.models.Course.deleteMany()
	await conn.models.Video.deleteMany()
})

afterAll(() => {
	conn.close()
})

const fixNonComparables = (object) => {
	delete object.__v
	delete object.createdAt
	delete object.updatedAt
}

describe('updateDoc', () => {
	it('should resolve and update a course doc', async () => {
		doc = {
			courseName: 'New Name',
			isTemplateCourse: false,
		}
		let updatedDoc = await crudOperations.updateDoc(
			'course',
			doc,
			'61805c2637afc2998b138b41'
		)
		let updatedObj = updatedDoc.toObject()
		fixNonComparables(updatedObj)
		expect(updatedObj).toMatchObject({
			_id: ObjectId('61805c2637afc2998b138b41'),
			authors: [],
			courseName: 'New Name',
			isTemplateCourse: false,
			sections: [],
			settings: null,
			students: [],
		})
	})

	it('should resolve and update a section within a course doc', async () => {
		doc = {
			sectionName: 'Section 12',
			orderInCourse: 12,
		}
		let updatedDoc = await crudOperations.updateDoc(
			'section',
			doc,
			'61805c2637afc2998b138b42',
			'61805cb137afc2998b138b4d'
		)
		let updatedObj = updatedDoc.toObject()
		fixNonComparables(updatedObj)
		expect(updatedObj).toMatchObject({
			_id: ObjectId('61805c2637afc2998b138b42'),
			authors: [],
			courseName: 'Course 2',
			isTemplateCourse: false,
			sections: [
				{
					_id: ObjectId('61805cb137afc2998b138b4d'),
					isViewable: false,
					modules: [],
					orderInCourse: 12,
					sectionName: 'Section 12',
				},
				{
					_id: ObjectId('61805cb137afc2998b138b4e'),
					isViewable: false,
					modules: [
						{
							moduleName: 'Module 1',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							content: [],
							_id: ObjectId('61805ee237afc2998b138b76'),
						},
						{
							moduleName: 'Module 2',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							content: [],
							_id: ObjectId('61805ee237afc2998b138b77'),
						},
					],
					orderInCourse: -1,
					sectionName: 'Section 2',
				},
			],
			settings: null,
			students: [],
		})
	})

	it('should resolve and update a module within a course doc', async () => {
		doc = {
			moduleName: 'Module 5',
			orderInSection: 5,
			isViewable: true,
		}
		let updatedDoc = await crudOperations.updateDoc(
			'module',
			doc,
			'61805c2637afc2998b138b42',
			'61805cb137afc2998b138b4e',
			'61805ee237afc2998b138b77'
		)
		let updatedObj = updatedDoc.toObject()
		fixNonComparables(updatedObj)
		expect(updatedObj).toMatchObject({
			_id: ObjectId('61805c2637afc2998b138b42'),
			authors: [],
			courseName: 'Course 2',
			isTemplateCourse: false,
			sections: [
				{
					_id: ObjectId('61805cb137afc2998b138b4d'),
					isViewable: false,
					modules: [],
					orderInCourse: -1,
					sectionName: 'Section 1',
				},
				{
					_id: ObjectId('61805cb137afc2998b138b4e'),
					isViewable: false,
					modules: [
						{
							moduleName: 'Module 1',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							content: [],
							_id: ObjectId('61805ee237afc2998b138b76'),
						},
						{
							moduleName: 'Module 5',
							orderInSection: 5,
							lectureDropDate: null,
							isViewable: true,
							content: [],
							_id: ObjectId('61805ee237afc2998b138b77'),
						},
					],
					orderInCourse: -1,
					sectionName: 'Section 2',
				},
			],
			settings: null,
			students: [],
		})
	})

	it('should resolve and update a content within the course doc', async () => {
		doc = {
			contentName: 'Important Video',
			orderInModule: 2,
		}
		let updatedDoc = await crudOperations.updateDoc(
			'content',
			doc,
			'61805c2637afc2998b138b44',
			'61805cb137afc2998b138b52',
			'61805ee237afc2998b138b54',
			'61805ee237afc2998b138b72'
		)
		let updatedObj = updatedDoc.toObject()
		fixNonComparables(updatedObj)
		expect(updatedObj).toMatchObject({
			_id: ObjectId('61805c2637afc2998b138b42'),
			authors: [],
			courseName: 'Course 2',
			isTemplateCourse: false,
			sections: [
				{
					_id: ObjectId('61805cb137afc2998b138b4d'),
					isViewable: false,
					modules: [],
					orderInCourse: -1,
					sectionName: 'Section 1',
				},
				{
					_id: ObjectId('61805cb137afc2998b138b4e'),
					isViewable: false,
					modules: [
						{
							moduleName: 'Module 1',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							content: [],
							_id: ObjectId('61805ee237afc2998b138b76'),
						},
						{
							moduleName: 'Module 2',
							orderInSection: -1,
							lectureDropDate: null,
							isViewable: false,
							content: [
								{
									contentName: 'Content 1',
									orderInModule: 0,
									toContent: ObjectId('61805ee237afc2998b138b61'),
									onModel: 'Video',
									data: [],
								},
								{
									contentName: 'Important Video',
									orderInModule: 2,
									toContent: ObjectId('61805ee237afc2998b138b65'),
									onModel: 'Video',
									data: [],
								},
							],
							_id: ObjectId('61805ee237afc2998b138b77'),
						},
					],
					orderInCourse: -1,
					sectionName: 'Section 2',
				},
			],
			settings: null,
			students: [],
		})
	})

	it('should resolve and update a video doc', async () => {
		doc = {
			originalname: 'BadVideo',
		}
		let updatedDoc = await crudOperations.updateDoc(
			'video',
			doc,
			'61805ee237afc2998b138550'
		)
		let updatedObj = updatedDoc.toObject()
		fixNonComparables(updatedObj)
		expect(updatedObj).toMatchObject({
			_id: ObjectId('61805ee237afc2998b138550'),
			destination: 'uploads/',
			encoding: '7bit',
			fieldname: 'video',
			filename: 'Video1.mp4',
			mimetype: 'video/mp4',
			originalname: 'BadVideo',
			path: 'uploads\\Video1.mp4',
			size: 8443873,
		})
	})

	it('should reject when the required ids are not put in', async () => {
		await expect(
			crudOperations.updateDoc('section', {}, '61805ee237afc2998b138550')
		).rejects.toThrow("'section' requires '2' ids. Provided '1'")
	})

	it('should reject when the model is not valid', async () => {
		await expect(
			crudOperations.updateDoc('mod', {}, '61805ee237afc2998b138550')
		).rejects.toThrow("Model 'mod' not found.")
	})

	it('should reject if no modelName is passed', async () => {
		await expect(crudOperations.updateDoc()).rejects.toThrow(
			"Model '' not found."
		)
	})

	it('should reject when nothing was found to be updated', async () => {
		await expect(
			crudOperations.updateDoc(
				'module',
				{},
				'61805ee237afc2998b138550',
				'61805ee237afc2998b138550',
				'61805ee237afc2998b138550'
			)
		).rejects.toThrow('No doc found to update')
	})
})
