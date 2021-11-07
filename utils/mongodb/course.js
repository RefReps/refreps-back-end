const conn = require('./dbConnection')
const Course = conn.models.Course
const { ObjectId } = require('mongoose').Types

const aggregateStages = {
	matchCourse: function (courseId) {
		return { $match: { _id: ObjectId(courseId) } }
	},
	unwindToSections: function () {
		return { $unwind: { path: '$sections' } }
	},
	matchSectionInCourse: function (sectionId) {
		return { $match: { 'sections._id': ObjectId(sectionId) } }
	},
	replaceRootWithSection: function () {
		return { $replaceRoot: { newRoot: '$sections' } }
	},
	unwindToModules: function () {
		return { $unwind: { path: '$modules' } }
	},
	matchModuleInSection: function (moduleId) {
		return { $match: { 'modules._id': ObjectId(moduleId) } }
	},
	replaceRootWithModule: function () {
		return { $replaceRoot: { newRoot: '$modules' } }
	},
	unwindToContent: function () {
		return { $unwind: { path: '$content' } }
	},
	matchContentInModule: function (contentId) {
		return { $match: { 'content._id': ObjectId(contentId) } }
	},
}

const aggregate = async (pipeline) => {
	return new Promise(async (resolve, reject) => {
		try {
			let doc = await Course.find(pipeline).exec()
			// const doc = 'd'
			resolve(doc)
		} catch (error) {
			reject(error)
		}
	})
}

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

// Get one course
// Resolves a course doc
// Rejects an error
module.exports.getCourseById = async (courseId) => {
	const pipeline = [aggregateStages.matchCourse(courseId)]
	return aggregate(pipeline)
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
			let course = await Course.findById({ _id: courseId }).exec()
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

module.exports.getAllModules = async (courseId, sectionId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let modulesDoc = await Course.aggregate()
				.match({ _id: ObjectId(courseId) })
				.unwind('sections')
				.match({ 'sections._id': ObjectId(sectionId) })
				.replaceRoot('sections')
				.unwind('modules')
				.replaceRoot('modules')
				.exec()
			resolve(modulesDoc)
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

module.exports.getModuleById = async (courseId, sectionId, moduleId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let moduleDoc = await Course.aggregate()
				.match({ _id: ObjectId(courseId) })
				.unwind('sections')
				.match({ 'sections._id': ObjectId(sectionId) })
				.replaceRoot('sections')
				.unwind('modules')
				.match({ 'modules._id': ObjectId(moduleId) })
				.replaceRoot('modules')
				.exec()
			resolve(moduleDoc[0])
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

// CONTENT FUNCTIONS

// Push a new content at the end of a module
// Resolve the course doc
// Reject the error
module.exports.pushNewContent = async (
	courseId,
	sectionId,
	moduleId,
	contentDoc
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{
					$push: {
						'sections.$[section].modules.$[module].content': contentDoc,
					},
				},
				{
					arrayFilters: [
						{ 'section._id': sectionId },
						{ 'module._id': moduleId },
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

// Get all content in a module
// Resolves an array of content docs
// Rejects the error
module.exports.getAllContentInModule = async (
	courseId,
	sectionId,
	moduleId
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contentsDoc = await Course.aggregate()
				.match({ _id: ObjectId(courseId) })
				.unwind('sections')
				.match({ 'sections._id': ObjectId(sectionId) })
				.replaceRoot('sections')
				.unwind('modules')
				.match({ 'modules._id': ObjectId(moduleId) })
				.replaceRoot('modules')
				.unwind('content')
				.replaceRoot('content')
				.exec()
			resolve(contentsDoc)
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

// Get single content in a module
// Resolves  content doc
// Rejects the error
module.exports.getContentById = async (
	courseId,
	sectionId,
	moduleId,
	contentId
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contentsDoc = await Course.aggregate()
				.match({ _id: ObjectId(courseId) })
				.unwind('sections')
				.match({ 'sections._id': ObjectId(sectionId) })
				.replaceRoot('sections')
				.unwind('modules')
				.match({ 'modules._id': ObjectId(moduleId) })
				.replaceRoot('modules')
				.unwind('content')
				.match({ 'content._id': ObjectId(contentId) })
				.replaceRoot('content')
				.exec()
			resolve(contentsDoc[0])
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

// Update a content,
// Resolves the updated course doc
// Rejects the error
module.exports.updateContent2 = async (
	courseId,
	sectionId,
	moduleId,
	contentId,
	contentDoc
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{
					$set: {
						'sections.$[secElem].modules.$[modElem].content.$[contElem]':
							contentDoc,
					},
				},
				{
					arrayFilters: [
						{ 'secElem._id': sectionId },
						{ 'modElem._id': moduleId },
						{ 'contElem._id': contentId },
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

const coursePaths = {
	root: '',
	section: 'sections.$[secElem]',
	module: 'sections.$[secElem].modules.$[modElem]',
	content: 'sections.$[secElem].modules.$[modElem].content.$[contElem]',
}
const courseArrayFilters = {
	root: function () {
		return []
	},
	section: function (sectionId) {
		return [{ 'secElem._id': sectionId }]
	},
	module: function (sectionId, moduleId) {
		return [{ 'secElem._id': sectionId }, { 'modElem._id': moduleId }]
	},
	content: function (sectionId, moduleId, contentId) {
		return [
			{ 'secElem._id': sectionId },
			{ 'modElem._id': moduleId },
			{ 'contElem._id': contentId },
		]
	},
}

// Constructor for making the $set fields in the update docs
// Returns a object of update fields
const constructSetUpdateFields = (doc, updatePath) => {
	let setUpdateObj = {}
	Object.entries(doc).forEach(([key, val]) => {
		setUpdateObj[`${updatePath}.${key}`] = val
	})
	return setUpdateObj
}

module.exports.updateContent = async (
	courseId,
	sectionId,
	moduleId,
	contentId,
	updateDoc = {}
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{
					$set: constructSetUpdateFields(updateDoc, coursePaths.content),
				},
				{
					arrayFilters: courseArrayFilters.content(
						sectionId,
						moduleId,
						contentId
					),
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

// Delete a content
// Resolves the updated course module
// Rejects the error
module.exports.deleteContent = async (
	courseId,
	sectionId,
	moduleId,
	contentId
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let course = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{
					$pull: {
						'sections.$[secElem].modules.$[modElem].content': {
							_id: contentId,
						},
					},
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
