const conn = require('./dbConnection')
const Course = conn.models.Course
const { ObjectId } = require('mongoose').Types

// COURSE ROOT FUNCTIONS

// Gets all of the courses wihtin the db
// Resolves an array of course docs
// Rejects the error
module.exports.getAllCourses = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			let courses = await Course.find({}).exec()
			resolve(courses)
		} catch (error) {
			reject(error)
		}
	})
}

// Add a new course to the db
// Resolves the newly created course doc
// Rejects the error
module.exports.addNewCourse = async (doc) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = new Course(doc)
			await course.save()
			resolve(course)
		} catch (error) {
			reject(error)
		}
	})
}

// Delete a single course by id from the db
// Resolves the deleted course
// Rejects the error
module.exports.deleteCourseById = async (courseId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findOneAndDelete({ _id: courseId }).exec()
			if (course === null) reject({ error: 'Course not found' })
			resolve(course)
		} catch (error) {
			reject(error)
		}
	})
}

// Get a single course by the id
// Resolves a course doc
// Rejects the error
module.exports.getCourseById = async (courseId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.find({ $match: { _id: courseId } }).exec()
			if (course === null) reject({ error: 'Course not found' })
			resolve(course)
		} catch (error) {
			reject(error)
		}
	})
}

// SECTION FUNCTIONS

// Push a new section at the end of the course sections
// Resolves the new course doc
// Rejects the error
module.exports.pushNewSection = async (courseId, sectionDoc) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findOneAndUpdate(
				{ _id: courseId },
				{ $push: { sections: sectionDoc } },
				{ new: true }
			).exec()
			resolve(course)
		} catch (error) {
			reject(error)
		}
	})
}

// Delete a section within a course
// Resolve the updated course
// Reject the error
module.exports.deleteSection = async (courseId, sectionId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findOneAndUpdate(
				{ _id: courseId },
				{ $pull: { sections: { _id: sectionId } } },
				{ new: true }
			).exec()
			resolve(course)
		} catch (error) {
			reject(error)
		}
	})
}

// Get one section doc
// Resolve a section doc object
// Reject the error
module.exports.getOneSection = async (courseId, sectionId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let section = await Course.aggregate([
				{ $match: { _id: ObjectId(courseId) } },
				{ $unwind: { path: '$sections' } },
				{ $match: { 'sections._id': ObjectId(sectionId) } },
				{ $project: { _id: 0, sections: 1 } },
			]).exec()
			resolve(section[0]['sections'])
		} catch (error) {
			reject(error)
		}
	})
}

// Get all sections in a course
// Resolves an array of sections from the course
// Rejects the error
module.exports.getAllSections = async (courseId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let section = await Course.aggregate([
				{ $match: { _id: ObjectId(courseId) } },
				{ $project: { _id: 0, sections: 1 } },
			]).exec()
			resolve(section[0]['sections'])
		} catch (error) {
			reject(error)
		}
	})
}

// Update a section within a course
// Resolve the course doc
// Reject the error
module.exports.updateSection = async (courseId, sectionId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findOneAndUpdate(
				{ _id: courseId, sections: { $elemMatch: { _id: sectionId } } },
				// { $set: {'sections.$[]'} },
				{ new: true, upsert: false }
			).exec()
			resolve(course)
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

// MODULE FUNCTIONS

// Push a new module at the end of a section
// Resolve the course doc
// Reject the error
module.exports.pushNewModule = async (courseId, sectionId, moduleDoc) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{ $push: { 'sections.$[elem].modules': moduleDoc } },
				{ arrayFilters: [{ 'elem._id': sectionId }], new: true }
			).exec()
			resolve(course)
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

// Update a module,
// Resolves the updated course doc
// Rejects the error
module.exports.updateModule = async (
	courseId,
	sectionId,
	moduleId,
	moduleDoc
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{
					$set: { 'sections.$[secElem].modules.$[modElem]': moduleDoc },
				},
				{
					arrayFilters: [
						{ 'secElem._id': sectionId },
						{ 'modElem._id': moduleId },
					],
					new: true,
				}
			).exec()
			resolve(course)
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

// Delete a module
// Resolves the updated course module
// Rejects the error
module.exports.deleteModule = async (courseId, sectionId, moduleId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{
					$pull: { 'sections.$[secElem].modules': { _id: moduleId } },
				},
				{
					arrayFilters: [{ 'secElem._id': sectionId }],
					new: true,
				}
			).exec()
			resolve(course)
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}
