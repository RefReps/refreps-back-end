const conn = require('../../../utils/mongodb/dbConnection')
const sectionUtil = require('../../../utils/mongodb/section')
require('dotenv').config({ path: '.env' })

beforeAll(async () => {
	await conn.openUri(process.env.DB_TEST)
	await conn.models.Section.deleteMany()
})

beforeEach(async () => {
	await new conn.models.Section({
		_id: '61793356928a024f0a2ba081',
		sectionName: 'Section 1',
		order: 1,
		isViewable: true,
		modules: [],
		__v: 0,
	}).save()
	await new conn.models.Section({
		_id: '61793356928a024f0a2ba085',
		sectionName: 'Section 2',
		order: 2,
		isViewable: true,
		modules: [],
		__v: 0,
	}).save()
})

afterEach(async () => {
	await conn.models.Section.deleteMany()
})

afterAll(async () => {
	conn.close()
})

describe('addNewSection', () => {
	it('resolves creating a new section', async () => {
		const doc = {
			_id: '61793356928a024f0a2ba030',
			sectionName: 'Section 5',
			order: 2,
			isViewable: true,
			modules: [],
			__v: 0,
		}
		await expect(sectionUtil.addNewSection(doc)).resolves.toMatchObject({})
	})

	it('rejects when section with _id is already in db', async () => {
		const doc = {
			_id: '61793356928a024f0a2ba085',
			sectionName: 'Section 5',
			order: 2,
			isViewable: true,
			modules: [],
			__v: 0,
		}
		await expect(sectionUtil.addNewSection(doc)).rejects.toMatchObject({})
	})

	it('rejects when no doc is passed', async () => {
		await expect(sectionUtil.addNewSection()).rejects.toMatchObject({
			error: 'must include doc',
		})
	})
})

describe('deleteSection', () => {
	it('resolves when a section is deleted in the db', async () => {
		await expect(
			sectionUtil.deleteSection('61793356928a024f0a2ba081')
		).resolves.toMatchObject({ deletedCount: 1 })
	})

	it('rejects if a section is not deleted', async () => {
		await expect(
			sectionUtil.deleteSection('61793356928a024f0a2ba021')
		).rejects.toMatchObject({ error: 'no section found to delete' })
	})

	it('rejects when no sectionId is passed', async () => {
		await expect(sectionUtil.deleteSection()).rejects.toMatchObject({
			error: 'must include sectionId',
		})
	})
})

describe('getSectionsById', () => {
	it('resolves successfully when given 1 sectionIds', async () => {
		const ids = ['61793356928a024f0a2ba025']
		await expect(sectionUtil.getSectionsById(ids)).resolves.toMatchObject({})
	})

	it('resolves successfully when given 2 sectionIds', async () => {
		const ids = ['61793356928a024f0a2ba025', '61793356928a024f0a2ba001']
		await expect(sectionUtil.getSectionsById(ids)).resolves.toMatchObject({})
	})

	it('rejects when no sectionIds are given', async () => {
		await expect(sectionUtil.getSectionsById()).rejects.toMatchObject({
			error: 'must include sectionIds',
		})
	})
})
