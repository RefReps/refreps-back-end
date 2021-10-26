const Joi = require('joi')

// Info Imports from schemas to easily reference the schema's properties
const { userInfo } = require('../schemas/user')
const { videoInfo } = require('../schemas/video')

module.exports.bodyValidator = bodyValidator = (schema) => (req, res, next) => {
	const { error } = schema.validate(req.body)
	if (error) {
		const errorMsg = error.details.map((detail) => detail.message)
		return res.status(400).json({ error: errorMsg })
	}
	return next()
}

// Register Validation Schema
module.exports.registerUserSchema = Joi.object({
	name: Joi.string().min(userInfo.name.min).required(),
	email: Joi.string().min(userInfo.email.min).required().email(),
	password: Joi.string().min(userInfo.password.min).required(),
})

// Login Validation Schema
module.exports.loginUserSchema = Joi.object({
	email: Joi.string().min(userInfo.email.min).required().email(),
	password: Joi.string().min(userInfo.password.min).required(),
})

// Course Creation Validation Schema
module.exports.courseCreationSchema = Joi.object({
	title: Joi.string().min(6).required(),
	templateCourse: Joi.bool(),
	description: Joi.string(),
	modules: Joi.array(),
	authors: Joi.array(),
	students: Joi.array(),
})

// Video Upload Validation Schema
module.exports.videoUploadSchema = Joi.object({
	fieldname: Joi.string(),
	originalname: Joi.string(),
	encoding: Joi.string(),
	mimetype: Joi.string(),
	destination: Joi.string(),
	filename: Joi.string(),
	path: Joi.string(),
	size: Joi.number(),
})
