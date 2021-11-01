const conn = require('./dbConnection')
const Course = conn.models.Course
const { ObjectId } = require('mongoose').Types

// COURSE ROOT FUNCTIONS

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

// SECTION FUNCTIONS

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
			console.log(error)
			reject(error)
		}
	})
}

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
