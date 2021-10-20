const { ValidationError } = require('joi')
const { mockRequest, mockResponse } = require('jest-mock-req-res')
const validation = require('../../../utils/validation')

// Section for testing Register Validation Schema

test('Return status 400 when the register user validation is failed due to invalid email input', () => {
	const req = new mockRequest({
		name: 'user',
		email: 'user',
		password: 'user123',
	})
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.registerUserSchema)(req, res, next)
	expect(res.status).toHaveBeenCalledWith(400)
	expect(res.json).toHaveBeenCalledTimes(1)
	expect(next).toHaveBeenCalledTimes(0)
})

test('Return status 400 when the register user validation is failed due to field missing', () => {
	const req = new mockRequest({
		email: 'user',
		password: 'user123',
	})
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.registerUserSchema)(req, res, next)
	expect(res.status).toHaveBeenCalledWith(400)
	expect(res.json).toHaveBeenCalledTimes(1)
	expect(next).toHaveBeenCalledTimes(0)
})

test('Go to next middleware when the register user validation is a success', () => {
	const req = new mockRequest()
	req.body = {
		name: 'user',
		email: 'user4@email.com',
		password: 'user123',
	}
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.registerUserSchema)(req, res, next)
	expect(next).toHaveBeenCalled()
	expect(next).toHaveBeenCalledTimes(1)
})

// Section for testing Login User Validation Schema

test('Return status 400 when the login user validation is failed due to invalid email input', () => {
	const req = new mockRequest()
	req.body = {
		email: 'user',
		password: 'user123',
	}
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.loginUserSchema)(req, res, next)
	expect(res.status).toHaveBeenCalledWith(400)
	expect(res.json).toHaveBeenCalledTimes(1)
	expect(next).toHaveBeenCalledTimes(0)
})

test('Return status 400 when the login user validation is failed due to field missing', () => {
	const req = new mockRequest()
	req.body = {
		email: 'user@email.com',
	}
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.loginUserSchema)(req, res, next)
	expect(res.status).toHaveBeenCalledWith(400)
	expect(res.json).toHaveBeenCalledTimes(1)
	expect(next).toHaveBeenCalledTimes(0)
})

test('Go to next middleware when the login user validation is a success', () => {
	const req = new mockRequest()
	req.body = {
		email: 'user@email.com',
		password: 'user123',
	}
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.loginUserSchema)(req, res, next)
	expect(next).toHaveBeenCalled()
	expect(next).toHaveBeenCalledTimes(1)
})

// Section for testing Course Creation Schema

test('Return status 400 when the course creation validation is failed due to invalid title input', () => {
	const req = new mockRequest()
	req.body = {
		title: 'title',
		templateCourse: false,
		description: '',
		modules: [],
		authors: [],
		students: [],
	}
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.courseCreationSchema)(req, res, next)
	expect(res.status).toHaveBeenCalledWith(400)
	expect(res.json).toHaveBeenCalledTimes(1)
	expect(next).toHaveBeenCalledTimes(0)
})

test('Return status 400 when the course creation validation is failed due to title field missing', () => {
	const req = new mockRequest()
	req.body = {
		templateCourse: false,
		description: 'some desc',
		modules: [],
		authors: [],
		students: [],
	}
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.courseCreationSchema)(req, res, next)
	expect(res.status).toHaveBeenCalledWith(400)
	expect(res.json).toHaveBeenCalledTimes(1)
	expect(next).toHaveBeenCalledTimes(0)
})

test('Go to next middleware when the course creation validation is a success', () => {
	const req = new mockRequest()
	req.body = {
		title: 'long-title',
		templateCourse: false,
		description: 'some desc',
		modules: [],
		authors: [],
		students: [],
	}
	const res = new mockResponse()
	const next = jest.fn()
	validation.bodyValidator(validation.courseCreationSchema)(req, res, next)
	expect(next).toHaveBeenCalled()
	expect(next).toHaveBeenCalledTimes(1)
})
