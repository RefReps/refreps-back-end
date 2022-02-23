const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')
const { makeFakeContent } = require('../../../__test__/fixtures')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')
const makeAddContent = require('./addContent')
const makeCopyContent = require('./copyContent')

describe('copyContent Test Suite', () => {
	const addContent = makeAddContent({ Content, Module })
	const copyContent = makeCopyContent({ Content })

	beforeAll(async () => {
		await dbConnect()
	})

	beforeEach(async () => {
		await Content.deleteMany({})
	})

	afterAll(async () => {
		await dbDisconnect()
	})

	it('successfully copies a content', async () => {
		const content = await addContent(makeFakeContent())

		const bindModuleId = '61f9fadbef472bd26d0e684f'
		const copy = await copyContent(
			content._id,
			bindModuleId,
			content.toDocument
		)
		expect(copy._id).not.toBe(content._id)
		expect(copy.moduleId).not.toBe(content.moduleId)
		expect({
			name: copy.name,
			toDocument: copy.toDocument,
			onModel: copy.onModel,
			isPublished: copy.isPublished,
			contentOrder: copy.contentOrder,
			dropDate: copy.dropDate,
		}).toEqual({
			name: content.name,
			toDocument: content.toDocument,
			onModel: content.onModel,
			isPublished: content.isPublished,
			contentOrder: content.contentOrder,
			dropDate: content.dropDate,
		})
	})

	it('fails to copy if cannot find the content', async () => {
		let errorName = 'nothing'
		try {
			await copyContent('61f9c07a5b333683766bae70')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('ReferenceError')
	})

	it('fails to copy if invalid id', async () => {
		let errorName = 'nothing'
		try {
			await copyContent('123')
		} catch (error) {
			errorName = error.name
		}
		expect(errorName).toBe('CastError')
	})

	// it('fails to add a content that does not have valid properties', async () => {
	// 	let errorName = 'nothing'
	// 	try {
	// 		await addContent(makeFakeContent({ name: '' }))
	// 	} catch (error) {
	// 		errorName = error.name
	// 	}
	// 	expect(errorName).toBe('ValidationError')
	// })
})
