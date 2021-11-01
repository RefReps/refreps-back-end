const validation = require('../../utils/validation')

describe('validCourseCreation', () => {
	it('should successfully validate a course', () => {
		courseDoc = {
			title: 'Basketball',
			templateCourse: false,
			description: 'This is a desc',
			modules: [],
			authors: [],
			students: [],
		}
		expect(validation.validCourseCreation(courseDoc)).toBe(true)
	})
	it('should give an errorMsg when title is not in courseDoc', () => {
		courseDoc = {
			templateCourse: false,
			description: 'This is a desc',
			modules: [],
			authors: [],
			students: [],
		}
		expect(validation.validCourseCreation(courseDoc)).toEqual([
			'"title" is required',
		])
	})
	it("should be true when the required values aren't there", () => {
		courseDoc = {
			title: 'Basketball',
		}
		expect(validation.validCourseCreation(courseDoc)).toBe(true)
	})
})

describe('validVideo', () => {
	it('should successfully validate a video', () => {
		videoDoc = {
			fieldname: 'video',
			originalname: 'some_video.mp4',
			encoding: '7bit',
			mimetype: 'video/mp4',
			destination: 'uploads/',
			filename: 'some_video.mp4',
			path: 'uploads\\some_video.mp4',
			size: 8443873,
		}
		expect(validation.validVideo(videoDoc)).toBe(true)
	})
	it('should give an errorMsg when originalname is not in courseDoc', () => {
		videoDoc = {
			fieldname: 'video',
			encoding: '7bit',
			mimetype: 'video/mp4',
			destination: 'uploads/',
			filename: 'some_video.mp4',
			path: 'uploads\\some_video.mp4',
			size: 8443873,
		}
		expect(validation.validVideo(videoDoc)).toEqual([
			'"originalname" is required',
		])
	})
})
