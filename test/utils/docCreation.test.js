const docCreation = require('../../utils/docCreation')

describe('parseValidCourseValues', () => {
	it('should resolve with keeping values from an object that are valid for updating a course doc', async () => {
		const originalDoc = {
			courseName: 'Football 101',
			name: 'Football',
		}
		const expectedDoc = {
			courseName: 'Football 101',
		}
		await expect(
			docCreation.parseValidCourseValues(originalDoc)
		).resolves.toMatchObject(expectedDoc)
	})

	it('should reject when there is no doc', async () => {
		await expect(docCreation.parseValidCourseValues()).rejects.toThrow(
			'Doc is empty'
		)
	})

	it('should reject when there are now valid values to parse', async () => {
		const originalDoc = {
			name: 'Should be courseName',
		}
		await expect(
			docCreation.parseValidCourseValues(originalDoc)
		).rejects.toThrow('Nothing to parse')
	})
})
