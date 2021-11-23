const makePostCourse = require('./post-course')
const { makeFakeCourse } = require('../../../__test__/fixtures/index')

describe('post course controller', () => {
	it('successfully posts a course', async () => {
		const postCourse = makePostCourse({ addCourse: (c) => c })
		const course = makeFakeCourse()
		const request = {
			headers: {
				'Content-Type': 'application/json',
			},
			body: course,
		}
		const expected = {
			headers: {
				'Content-Type': 'application/json',
				'Last-Modified': new Date(request.body.modifiedOn).toUTCString(),
			},
			statusCode: 201,
			body: { posted: request.body },
		}
		const actual = await postCourse(request)
		expect(actual).toEqual(expected)
	})

	it('reports user errors', async () => {
		const postCourse = makePostCourse({
			addCourse: () => {
				throw Error('Oof!')
			},
		})
		const fakeCourse = makeFakeCourse()
		const request = {
			headers: {
				'Content-Type': 'application/json',
			},
			body: fakeCourse,
		}
		const expected = {
			headers: {
				'Content-Type': 'application/json',
			},
			statusCode: 400,
			body: { error: 'Oof!' },
		}
		const actual = await postCourse(request)
		expect(actual).toEqual(expected)
	})
})
