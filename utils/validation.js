const Joi = require('joi')

// Info Imports from schemas to easily reference the schema's properties
const { courseInfo } = require('../schemas/course')
const { videoInfo } = require('../schemas/video')

// Should be moved to middleware
module.exports.bodyValidator = (schema) => (req, res, next) => {
	const { error } = schema.validate(req.body)
	if (error) {
		const errorMsg = error.details.map((detail) => detail.message)
		return res.status(400).json({ error: errorMsg })
	}
	return next()
}

module.exports.validCourseCreation = (doc) => {
	const { error } = courseCreationSchema.validate(doc)
	if (error) {
		const errorMsg = error.details.map((detail) => detail.message)
		return errorMsg
	}
	return true
}

// Course Creation Validation Schema
const courseCreationSchema = Joi.object({
	title: Joi.string().min(6).required(),
	templateCourse: Joi.bool(),
	description: Joi.string(),
	modules: Joi.array(),
	authors: Joi.array(),
	students: Joi.array(),
})

module.exports.validVideo = (doc) => {
	const { error } = videoSchema.validate(doc)
	if (error) {
		const errorMsg = error.details.map((detail) => detail.message)
		return errorMsg
	}
	return true
}

// Video Upload Validation Schema
const videoSchema = Joi.object({
	fieldname: Joi.string().required(),
	originalname: Joi.string().required(),
	encoding: Joi.string().required(),
	mimetype: Joi.string().required(),
	destination: Joi.string().required(),
	filename: Joi.string().required(),
	path: Joi.string().required(),
	size: Joi.number().required(),
})
