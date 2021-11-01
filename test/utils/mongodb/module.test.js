const conn = require('../../../utils/mongodb/dbConnection')
const moduleUtil = require('../../../utils/mongodb/module')
require('dotenv').config({ path: '.env' })

beforeAll(async () => {
	await conn.openUri(process.env.DB_TEST)
	await conn.models.Module.deleteMany()
})

beforeEach(async () => {
	await new conn.models.Module({
		_id: '61793356928a024f0a2ba064',
		moduleName: 'Module 1',
		lectureDropDate: null,
		isViewable: true,
		content: [],
		__v: 0,
	}).save()
	await new conn.models.Module({
		_id: '61793356928a024f0a2ba066',
		moduleName: 'Module 2',
		lectureDropDate: null,
		isViewable: true,
		content: [],
		__v: 0,
	}).save()
})

afterEach(async () => {
	await conn.models.Module.deleteMany()
})

afterAll(async () => {
	conn.close()
})

describe('addNewModule', () => {
	it('resolves creating a new module', async () => {
		const doc = {
			_id: '61793356928a024f0a2ba030',
			moduleName: 'Module 6',
			lectureDropDate: null,
			isViewable: true,
			content: [],
			__v: 0,
		}
		await expect(moduleUtil.addNewModule(doc)).resolves.toMatchObject({})
	})

	it('rejects when module with _id is already in db', async () => {
		const doc = {
			_id: '61793356928a024f0a2ba066',
			moduleName: 'Module 6',
			lectureDropDate: null,
			isViewable: true,
			content: [],
			__v: 0,
		}
		await expect(moduleUtil.addNewModule(doc)).rejects.toMatchObject({
			error: 'addNewModule could not save new module',
		})
	})

	it('rejects when no doc is passed', async () => {
		await expect(moduleUtil.addNewModule()).rejects.toMatchObject({
			error: 'must include doc',
		})
	})
})

describe('deleteModule', () => {
	it('resolves when a module is deleted in the db', async () => {
		await expect(
			moduleUtil.deleteModule('61793356928a024f0a2ba066')
		).resolves.toMatchObject({ deletedCount: 1 })
	})

	it('rejects if a module is not deleted', async () => {
		await expect(
			moduleUtil.deleteModule('61793356928a024f0a2ba030')
		).rejects.toMatchObject({ error: 'no module found to delete' })
	})

	it('rejects when no moduleId is passed', async () => {
		await expect(moduleUtil.deleteModule()).rejects.toMatchObject({
			error: 'must include moduleId',
		})
	})
})

describe('getModulesById', () => {
	it('resolves successfully when given 1 moduleId', async () => {
		const ids = ['61793356928a024f0a2ba025']
		await expect(moduleUtil.getModulesById(ids)).resolves.toMatchObject({})
	})

	it('resolves successfully when given 2 moduleIds', async () => {
		const ids = ['61793356928a024f0a2ba025', '61793356928a024f0a2ba001']
		await expect(moduleUtil.getModulesById(ids)).resolves.toMatchObject({})
	})

	it('rejects when no moduleIds are given', async () => {
		await expect(moduleUtil.getModulesById()).rejects.toMatchObject({
			error: 'must include moduleIds',
		})
	})
})
