const validValuesParser = require('../../utils/validValuesParser')

describe('parseValidValues', () => {
	it('should resolve and return an object that has values from the original doc that are valid', async () => {
		const originalDoc = {
			courseName: 'Football 101',
			name: 'Football',
		}
		const expectedDoc = {
			courseName: 'Football 101',
		}
		await expect(
			validValuesParser.parseValidValues(
				originalDoc,
				validValuesParser.validKeys.validCourseKeys
			)
		).resolves.toMatchObject(expectedDoc)
	})

	it('should reject when there is no doc', async () => {
		await expect(validValuesParser.parseValidValues()).rejects.toThrow(
			'Doc is empty'
		)
	})

	it('should reject when validKeys aren\'t passed (aka, validKeys=[""])', async () => {
		const originalDoc = { courseName: 'Football 101' }
		await expect(
			validValuesParser.parseValidValues(originalDoc)
		).rejects.toThrow('Nothing to parse')
	})

	it('should reject when there are now valid values to parse', async () => {
		const originalDoc = {
			name: 'Should be courseName',
		}
		await expect(
			validValuesParser.parseValidValues(
				originalDoc,
				validValuesParser.validKeys.validCourseKeys
			)
		).rejects.toThrow('Nothing to parse')
	})
})
