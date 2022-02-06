const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')
const { User, Course } = require('../use-cases/index')

// Middleware Imports
const { isAuthenticated } = require('../utils/middleware/auth')
const { authorizeAdmin } = require('../utils/middleware/userRole')

router.use(isAuthenticated)

router
	.route('/')
	.get(async (req, res) => {
		try {
			const user = await User.findUserByEmail(req.email)
			let result
			if (user.role === 'admin') {
				result = await Course.findAllCourses()
			} else {
				result = await Course.findAllCoursesForUser(user._id)
			}
			res.send(result.courses)
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})
	// Post a new course.
	// Admin only route
	.post(multer.none(), authorizeAdmin, async (req, res) => {
		try {
			const course = await Course.addCourse(req.body)
			res.send(course)
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:courseId')
	.get(async (req, res) => {
		try {
			const { courseId } = req.params
			const result = await Course.findCourseById(courseId, {
				userEmail: req.email,
			})
			res.send(result.course)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// Delete a course
	// Admin route only
	.delete(authorizeAdmin, async (req, res) => {
		try {
			const { courseId } = req.params
			const result = await Course.deleteCourse(courseId)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	.put(multer.none(), async (req, res) => {
		try {
			const { courseId } = req.params
			const result = await Course.updateCourse(courseId, req.body)
			res.send(result.course)
		} catch (error) {
			res.status(400).send(error)
		}
	})

// Admin only route
router
	.route('/:courseId/author/:email')
	// Adds a user as an author to the course
	// Admin route only
	.post(authorizeAdmin, async (req, res) => {
		try {
			const { email, courseId } = req.params
			const user = await User.findUserByEmail(email)
			await User.addAuthorInCourse(user._id, courseId)
			res.status(204).send()
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})
	// Removes a user as an author to the course
	// Admin route only
	.delete(authorizeAdmin, async (req, res) => {
		try {
			const { email, courseId } = req.params
			const user = await User.findUserByEmail(email)
			await User.removeAuthorInCourse(user._id, courseId)
			res.status(204).send()
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

// Adds multiple authors to a course
// Reads Json body
// Requires req.body.emails = ['user@email.com', ...]
router.route('/:courseId/authors').post(async (req, res) => {
	try {
		const { emails } = req.body
		const { courseId } = req.params
		if (!emails) {
			throw ReferenceError('req.body.email is required')
		}
		if ((await Course.findCourseById(courseId)).found === 0) {
			throw ReferenceError('Course is not in db')
		}

		emails.forEach(async (email) => {
			try {
				let user = await User.findUserByEmail(email)
				await User.addAuthorInCourse(user._id, courseId)
			} catch (error) {
				console.log({ error: error.name, message: error.message })
			}
		})
		res.status(204).send()
	} catch (error) {
		res
			.status(400)
			.json({ success: false, error: error.name, reason: error.message })
	}
})

// Removes batch of authors from course
// Requires req.body to be json
// Requires req.body.emails = ["user1@email.com", ...]
router.route('/:courseId/authors/remove').post(async (req, res) => {
	try {
		const { emails } = req.body
		const { courseId } = req.params
		if (!emails) {
			throw ReferenceError('req.body.email is required')
		}
		if ((await Course.findCourseById(courseId)).found === 0) {
			throw ReferenceError('Course is not in db')
		}

		emails.forEach(async (email) => {
			try {
				let user = await User.findUserByEmail(email)
				await User.removeAuthorInCourse(user._id, courseId)
			} catch (error) {
				console.log({ error: error.name, message: error.message })
			}
		})
		res.status(204).send()
	} catch (error) {
		res
			.status(400)
			.json({ success: false, error: error.name, reason: error.message })
	}
})

// Admin route, and Author route that are in that course
router
	.route('/:courseId/student/:email')
	// Adds a user as a student to the course
	.post(async (req, res) => {
		try {
			const { email, courseId } = req.params
			const user = await User.findUserByEmail(email)
			await User.addStudentInCourse(user._id, courseId)
			res.status(204).send()
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})
	// Removes a user as a student to the course
	.delete(async (req, res) => {
		try {
			const { email, courseId } = req.params
			const user = await User.findUserByEmail(email)
			await User.removeStudentInCourse(user._id, courseId)
			res.status(204).send()
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

// Adds multiple students to a course
// Reads Json body
// Requires req.body.emails = ['user@email.com', ...]
router.route('/:courseId/students').post(async (req, res) => {
	try {
		const { emails } = req.body
		const { courseId } = req.params
		if (!emails) {
			throw ReferenceError('req.body.email is required')
		}
		if ((await Course.findCourseById(courseId)).found === 0) {
			throw ReferenceError('Course is not in db')
		}

		emails.forEach(async (email) => {
			try {
				let user = await User.findUserByEmail(email)
				await User.addStudentInCourse(user._id, courseId)
			} catch (error) {
				console.log({ error: error.name, message: error.message })
			}
		})
		res.status(204).send()
	} catch (error) {
		res
			.status(400)
			.json({ success: false, error: error.name, reason: error.message })
	}
})

// Removes multiple students from a course
// Reads Json body
// Requires req.body.emails = ['user@email.com', ...]
router.route('/:courseId/students/remove').post(async (req, res) => {
	try {
		const { emails } = req.body
		const { courseId } = req.params
		if (!emails) {
			throw ReferenceError('req.body.email is required')
		}
		if ((await Course.findCourseById(courseId)).found === 0) {
			throw ReferenceError('Course is not in db')
		}

		emails.forEach(async (email) => {
			try {
				let user = await User.findUserByEmail(email)
				await User.removeStudentInCourse(user._id, courseId)
			} catch (error) {
				console.log({ error: error.name, message: error.message })
			}
		})
		res.status(204).send()
	} catch (error) {
		res
			.status(400)
			.json({ success: false, error: error.name, reason: error.message })
	}
})

router
	.route('/:courseId/copy')
	.post(authorizeAdmin, multer.none(), async (req, res) => {
		try {
			const { courseId } = req.params
			const overrides = req.body

			const course = await Course.copyCourse(courseId, overrides)

			const { sections } = await useCases.Section.findAllSections(courseId)
			sections.forEach(async (section) => {
				// Copy all sections and bind them to the new course
				let sectionCopy = await useCases.Section.copySection(
					section._id,
					course._id
				)

				let { modules } = await useCases.Module_.findAllModules(section._id)
				modules.forEach(async (module_) => {
					// Copy all modules and bind them to the new section, resp.
					let moduleCopy = await useCases.Module_.copyModule(
						module_._id,
						sectionCopy._id
					)
					let { contents } = await useCases.Content.findAllContents(module_._id)
					contents.forEach(async (content) => {
						// Copy the document that the Content points to (if needed)
						let bindDocumentId
						switch (content.onModel) {
							case 'Video':
								bindDocumentId = content.toDocument
								break
							case 'Quiz':
								const quiz = await useCases.Quiz.copyQuiz(content.toDocument)
								bindDocumentId = quiz._id
							default:
								bindDocumentId = content.toDocument
						}

						// Copy the Content, bind the Content to its resp Module, and
						// bind the document
						await useCases.Content.copyContent(
							content._id,
							moduleCopy._id,
							bindDocumentId
						)

						// TODO: If video -> dont do anything else
						// If quiz -> copy the quiz (change toDocument in content) so that it can be edited
					})
				})
			})

			res.status(201).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})

module.exports = router
