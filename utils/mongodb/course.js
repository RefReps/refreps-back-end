const conn = require('./dbConnection')
const Course = conn.models.Course
const { ObjectId } = require('mongoose').Types

module.exports.addNewCourse = async (doc) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doc) return reject({ error: 'must include doc' })

			let course = new Course(doc)
			await course.save()
			return resolve(course)
		} catch (error) {
			return reject({ error: 'addNewCourse could not save new course' })
		}
	})
}

module.exports.deleteCourse = async (courseId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!courseId) return reject({ error: 'must inlcude courseId' })

			let deletedCount = await Course.deleteOne({ _id: courseId }).exec()
			if (deletedCount['deletedCount'] === 0)
				return reject({ error: 'no course found to delete' })
			return resolve(deletedCount)
		} catch (error) {
			return reject({ error: 'deleteCourse could not delete course' })
		}
	})
}

module.exports.getCoursesById = async (courseIds = []) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (courseIds.length === 0)
				return reject({ error: 'must include courseIds' })

			let courses = await Course.find({ _id: { $in: courseIds } }).exec()
			return resolve(courses)
		} catch (error) {
			return reject({
				error: 'getCoursesById could not query courses',
			})
		}
	})
}

module.exports.updateCourseById = async (courseId, updateDoc) => {
	return new Promise(async (resolve, reject) => {
		try {
			let updatedCourse = await Course.findOneAndUpdate(
				{ _id: courseId },
				updateDoc,
				{ upsert: false, new: true }
			)
			if (updatedCourse === null)
				return reject({ error: 'No course found to update' })
			return resolve(updatedCourse)
		} catch (error) {
			return reject({ error: 'cannot update course' })
		}
	})
}

module.exports.pushSectionIntoCourse = async (courseId, sectionId) => {
	// TODO: check to see if section exists
	return await this.updateCourseById(courseId, {
		$addToSet: { sections: sectionId }, // addToSet for unique sections
	})
}

module.exports.getAllSectionsInCourseBrief = async (courseId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let sections = await Course.aggregate([
				{ $match: { _id: ObjectId(courseId) } },
				{
					$lookup: {
						from: 'sections',
						localField: 'sections',
						foreignField: '_id',
						as: 'sectionsObjects',
					},
				},
				{
					$project: {
						_id: 1,
						courseName: 1,
						sectionsObjects: 1,
					},
				},
			]).exec()
			return resolve(sections)
		} catch (error) {
			return reject({ error: 'cannot find sections' })
		}
	})
}
