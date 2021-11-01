const conn = require('../../../utils/mongodb/dbConnection')
const courseUtil = require('../../../utils/mongodb/course')
require('dotenv').config({ path: '.env' })

beforeAll(async () => {
	await conn.openUri(process.env.DB_TEST)
	await conn.models.Course.deleteMany()
})

beforeEach(async () => {
	await new conn.models.Course({
		_id: '61793356928a024f0a2ba025',
		courseName: 'Course 1',
		isTemplateCourse: false,
		sections: [],
		authors: [],
		students: [],
		settings: null,
		__v: 0,
	}).save()
	await new conn.models.Course({
		_id: '61793356928a024f0a2ba001',
		courseName: 'Course 2',
		isTemplateCourse: false,
		sections: [],
		authors: [],
		students: [],
		settings: null,
		__v: 0,
	}).save()
})

afterEach(async () => {
	await conn.models.Course.deleteMany()
})

afterAll(async () => {
	conn.close()
})

describe('addNewCourse', () => {
	it('resolves creating a new course', async () => {
		const doc = {
			_id: '61793356928a024f0a2ba030',
			courseName: 'Course 3',
			isTemplateCourse: false,
			sections: [],
			authors: [],
			students: [],
			settings: null,
			__v: 0,
		}
		await expect(courseUtil.addNewCourse(doc)).resolves.toMatchObject({})
	})

	it('rejects when course with _id is already in db', async () => {
		const doc = {
			_id: '61793356928a024f0a2ba025',
			courseName: 'Course 3',
			isTemplateCourse: false,
			sections: [],
			authors: [],
			students: [],
			settings: null,
			__v: 0,
		}
		await expect(courseUtil.addNewCourse(doc)).rejects.toMatchObject({
			error: 'addNewCourse could not save new course',
		})
	})

	it('rejects when no doc is passed', async () => {
		await expect(courseUtil.addNewCourse()).rejects.toMatchObject({
			error: 'must include doc',
		})
	})
})

describe('deleteCourse', () => {
	it('resolves when a course is deleted in the db', async () => {
		await expect(
			courseUtil.deleteCourse('61793356928a024f0a2ba025')
		).resolves.toMatchObject({ deletedCount: 1 })
	})

	it('rejects if a course is not deleted', async () => {
		await expect(
			courseUtil.deleteCourse('61793356928a024f0a2ba021')
		).rejects.toMatchObject({ error: 'no course found to delete' })
	})

	it('rejects when no courseId is passed', async () => {
		await expect(courseUtil.deleteCourse()).rejects.toMatchObject({
			error: 'must inlcude courseId',
		})
	})
})

describe('getCoursesById', () => {
	it('resolves successfully when given 1 courseId', async () => {
		const ids = ['61793356928a024f0a2ba025']
		await expect(courseUtil.getCoursesById(ids)).resolves.toMatchObject({})
	})

	it('resolves successfully when given 2 courseIds', async () => {
		const ids = ['61793356928a024f0a2ba025', '61793356928a024f0a2ba001']
		await expect(courseUtil.getCoursesById(ids)).resolves.toMatchObject({})
	})

	it('rejects when no courseIds are given', async () => {
		await expect(courseUtil.getCoursesById()).rejects.toMatchObject({
			error: 'must include courseIds',
		})
	})
})
