const coursesCollection = require('../../../utils/mongodb/coursesCollection')

const conn = require('../../../utils/mongodb/dbConnection')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
require('dotenv').config({ path: '.env' })

// Connect to the given test db
beforeAll(async () => {
	await conn.openUri(process.env.DB_TEST)
	await conn.models.Course.deleteMany()
})

// Setup the db for courseCollection tests
beforeEach(async () => {
	await conn.models
		.Course({
			__v: 0,
			_id: ObjectId('6178a7b52c3d667fa5436e91'),
			authors: [],
			courseName: 'Basketball 1',
			createdAt: Date('2021-10-27T01:13:25.245Z'),
			isTemplateCourse: false,
			sections: [],
			students: [],
			updatedAt: Date('2021-10-27T01:13:25.245Z'),
		})
		.save()
	await conn.models
		.Course({
			__v: 0,
			_id: ObjectId('6178a7b52c3d667fa5436e92'),
			authors: [],
			courseName: 'Basketball 2',
			isTemplateCourse: false,
			sections: [],
			students: [],
		})
		.save()
})

// Teardown the uploaded documents
afterEach(async () => {
	await conn.models.Course.deleteMany()
})

// Close the connection after all tests run
afterAll(async () => {
	await conn.close()
})

describe('queryAllCourses', () => {
	it('should successfully query all course if the course exists', async () => {
		const data = await coursesCollection.queryAllCourses()
		data.forEach((ele) => {
			delete ele.createdAt
			delete ele.updatedAt
		})
		expect(data).toEqual([
			{
				__v: 0,
				_id: ObjectId('6178a7b52c3d667fa5436e91'),
				authors: [],
				courseName: 'Basketball 1',
				isTemplateCourse: false,
				sections: [],
				students: [],
			},
			{
				__v: 0,
				_id: ObjectId('6178a7b52c3d667fa5436e92'),
				authors: [],
				courseName: 'Basketball 2',
				isTemplateCourse: false,
				sections: [],
				students: [],
			},
		])
	})
})

describe('queryOneCourseById', () => {
	it('should query one course when multiple are in the db', async () => {
		const data = await coursesCollection.queryOneCourseById(
			'6178a7b52c3d667fa5436e91'
		)
		data.forEach((ele) => {
			delete ele.createdAt
			delete ele.updatedAt
		})
		expect(data).toEqual([
			{
				__v: 0,
				_id: ObjectId('6178a7b52c3d667fa5436e91'),
				authors: [],
				courseName: 'Basketball 1',
				isTemplateCourse: false,
				sections: [],
				students: [],
			},
		])
	})

	it('should recieve an empty array when the course is not in the db', async () => {
		const data = await coursesCollection.queryOneCourseById(
			'6178a7b52c3d667fa5436e98'
		)
		expect(data).toEqual([])
	})
})

describe('createNewCourse', () => {
	it('should successfully create a new course', async () => {
		doc = {
			_id: ObjectId('6178b81e2bb5f5cfda91d494'),
			courseName: 'Basketball 1',
		}
		let createdCourse = await coursesCollection.createNewCourse(doc)
		expect(createdCourse).resolves
	})

	it('should reject if the required fields are not passed in the doc', async () => {
		expect.assertions(1)
		doc = {
			description: 'this is a desc',
			authors: [],
		}
		await expect(coursesCollection.createNewCourse(doc)).rejects.toEqual({
			error: 'ValidationError: courseName: Path `courseName` is required.',
		})
	})
})
