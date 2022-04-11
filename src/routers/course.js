const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')
const { User, Course, Quiz } = require('../use-cases/index')

// Middleware Imports
const {
	isAuthenticated,
	authorizeAdmin,
	bindUserIdFromEmail,
} = require('../utils/middleware/index')
const courseMiddleware = require('../middleware/course')
const { buildErrorResponse } = require('../utils/responses/index')

// utils
const mailUtil = require('../utils/email/index')

router.use(isAuthenticated)
router.use(bindUserIdFromEmail)

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
	.route('/:courseId/complete')
	.get(courseMiddleware.studentFullCourseStructure)

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
			const result = await Course.deleteCourse(courseId, { softDelete: true })
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

router.route('/:courseId/members').get(async (req, res) => {
	try {
		const { courseId } = req.params
		const users = await User.findAllUsersInCourse(courseId)
		res.status(200).json(users)
	} catch (error) {
		res
			.status(400)
			.json({ success: false, error: error.name, reason: error.message })
	}
})

router
	.route('/:courseId/authors')
	.get(async (req, res) => {
		try {
			const { courseId } = req.params
			const users = await User.findAllUsersInCourse(courseId, {
				includeStudents: false,
			})
			res.status(200).json(users)
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})
	// Adds multiple authors to a course
	// Reads Json body
	// Requires req.body.emails = ['user@email.com', ...]
	.post(async (req, res) => {
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

router
	.route('/:courseId/students')
	// Get all students in the course
	.get(async (req, res) => {
		try {
			const { courseId } = req.params
			const users = await User.findAllUsersInCourse(courseId, {
				includeAuthors: false,
			})
			res.status(200).json(users)
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})
	// Adds multiple students to a course
	// Reads Json body
	// Requires req.body.emails = ['user@email.com', ...]
	.post(async (req, res) => {
		try {
			const { emails } = req.body
			const { courseId } = req.params
			if (!emails) {
				throw ReferenceError('req.body.email is required')
			}
			if ((await Course.findCourseById(courseId)).found === 0) {
				throw ReferenceError('Course is not in db')
			}

			const { course } = await Course.findCourseById(courseId)
			let studentsLength =
				course.students.length != undefined ? course.students.length : 999

			// Add emails until course is full (if applicable)
			emails.forEach(async (email) => {
				try {
					// check if user is in the database
					if (!(await User.isUserInSystem(email))) {
						// if not, send email to user to create account
						await mailUtil.sendEmailCourseLinkToNewUser({
							email,
							courseObj: course,
							transport_strategy: mailUtil.TRANSPORTER_STRATEGY.GMAIL,
						})
						return
					}

					// get user
					const user = await User.findUserByEmail(email)

					// check if user is already in course
					if (course.students.find((student) => student._id.equals(user._id))) {
						return
					}

					if (studentsLength < course.settings.courseCapacity) {
						await User.addStudentInCourse(user._id, courseId)
						studentsLength++

						// send email to user that they have been added to course
						await mailUtil.sendEmailCourseLinkToExistingUser({
							email: user.email,
							courseObj: course,
							transport_strategy: mailUtil.TRANSPORTER_STRATEGY.GMAIL,
						})
					}
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

const isCourseFull = (course, studentLength) => {
	return studentLength >= course.settings.courseCapacity
}

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
			const { authorEmail } = req.body

			const courseCopy = await Course.copyCourse(courseId, overrides)

			const { course } = await Course.getCourseSkeleton(courseId)

			course.sections.forEach(async (section) => {
				// Copy all sections and bind them to the new course
				let sectionCopy = await useCases.Section.copySection(
					section._id,
					courseCopy._id
				)

				section.modules.forEach(async (module_) => {
					// Copy all modules and bind them to the new section, resp.
					let moduleCopy = await useCases.Module_.copyModule(
						module_._id,
						sectionCopy._id
					)
					module_.contents.forEach(async (content) => {
						// Copy the document that the Content points to (if needed)
						let bindDocumentId
						switch (content.onModel) {
							case 'Video':
								bindDocumentId = content.toDocument
								break
							case 'Quiz':
								const { quiz } = await useCases.Quiz.copyQuiz(
									content.toDocument
								)
								bindDocumentId = quiz._id
								break
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
						console.log('copied content')

						// TODO: If video -> dont do anything else
						// If quiz -> copy the quiz (change toDocument in content) so that it can be edited
					})
				})
			})

			// Add author if provided
			if (authorEmail) {
				const user = await User.findUserByEmail(authorEmail)
				await User.addAuthorInCourse(user._id, courseCopy._id)
			}

			res.status(201).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/code/:courseCode')
	.put(courseMiddleware.appendStudentOnCourseByCode, (req, res) => {
		res.status(200).json({ success: true })
	})

router
	.route('/:courseId/settings/author')
	.put(courseMiddleware.updateCourseSettingsAuthor, async (req, res) => {
		try {
			const { course } = await Course.findCourseById(req.params.courseId)
			res.status(200).json({ success: true, course: course })
		} catch (error) {
			res.status(400).json({ success: false })
		}
	})

router
	.route('/:courseId/settings/admin')
	.put(
		authorizeAdmin,
		courseMiddleware.updateCourseSettingsAdmin,
		async (req, res) => {
			try {
				const { course } = await Course.findCourseById(req.params.courseId)
				res.status(200).json({ success: true, course: course })
			} catch (error) {
				res.status(400).json({ success: false })
			}
		}
	)

// Individual student routes for course grades
router.route('/:courseId/grades-student').get(async (req, res) => {
	try {
		const { email } = req
		if (!email) {
			throw ReferenceError('req.email needs to be provided')
		}
		const { course } = await Course.findCourseById(req.params.courseId)
		const user = await User.findUserByEmail(email)
		const { submissions } = await Quiz.getAllBestQuizzesInACourse(
			course._id,
			user._id
		)

		res.status(200).json({ submissions })
	} catch (error) {
		res.status(400).json(buildErrorResponse(error))
	}
})

// TODO: Add author only route
router.route('/:courseId/grades-student/:studentId').get(async (req, res) => {
	try {
		const { courseId, studentId } = req.params
		const { submissions } = await Quiz.getAllBestQuizzesInACourse(
			courseId,
			studentId
		)

		res.status(200).json({ submissions })
	} catch (error) {
		res.status(400).json(buildErrorResponse(error))
	}
})

// Author routes for course grades
router.route('/:courseId/grades-all').get(async (req, res) => {
	try {
		const { course } = await Course.findCourseById(req.params.courseId)
		const { overviews } = await Quiz.getCourseQuizzesOverview(course._id)
		res.status(200).json({ overviews })
	} catch (error) {
		res.status(400).json(buildErrorResponse(error))
	}
})

module.exports = router
