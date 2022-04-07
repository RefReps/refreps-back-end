module.exports = makeGetCourseQuizzesOverview = ({
	Quiz,
	QuizSubmission,
	Course,
	User,
}) => {
	return async function getCourseQuizzesOverview(courseId) {
		try {
			if (!courseId)
				throw new ReferenceError(
					'`courseId` must be provided in `getAllBestQuizzesInACourse`.'
				)

			// Find a course and get all quizzes
			const courseDoc = await Course.findById(courseId)
				.populate({
					path: 'sections',
					populate: {
						path: 'modules',
						populate: {
							path: 'contents',
							populate: {
								path: 'toDocument',
							},
						},
					},
				})
				.populate('students')
				.exec()

			// If no course is found, throw an error
			if (!courseDoc) {
				throw new ReferenceError('No course found.')
			}

			const course = courseDoc.toObject({ flattenMaps: true })

			// Get all students in the course
			const students = course.students

			// Get all quizzes from the course
			const quizzes = []
			course.sections.forEach((section) => {
				section.modules.forEach((module) => {
					module.contents.forEach((content) => {
						if (content.onModel == 'Quiz') {
							quizzes.push(content.toDocument)
						}
					})
				})
			})

			// Get best quiz submissions for each quiz per user
			const result = []
			await Promise.all(
				students.map(async (student) => {
                    const bestQuizSubmissions = await QuizSubmission.aggregate([
                        {
                            $match: {
                                quizId: { $in: quizzes.map(quiz => quiz._id) },
                                userId: student._id,
                                isGraded: true,
                            },
                        },
                        {
                            $sort: {
                                grade: -1,
                                submissionNumber: -1,
                            },
                        },
                        {
                            $group: {
                                _id: '$quizId',
                                bestSubmission: {
                                    $first: '$$ROOT',
                                },
                            },
                        }
                    ]).exec()

					// get the count of quizzes taken by the user
					const quizzesTakenCount = bestQuizSubmissions.filter(quiz => quiz.bestSubmission).length

                    // Calculate the average score from the best quiz submissions
                    let averageScore
                    if (quizzesTakenCount > 0) {
                        averageScore = bestQuizSubmissions.reduce((acc, curr) => {
                            return acc + curr.bestSubmission.grade
                        }, 0) / quizzesTakenCount
                    } else {
                        averageScore = 1
                    }

                    if (!averageScore) {
                        averageScore = 0
                    }

                    result.push({
                        user: {_id: student._id, email: student.email},
                        courseGrade: averageScore
                    })
				})
			)

			return Promise.resolve({ overviews: result })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
