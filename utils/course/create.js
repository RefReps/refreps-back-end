const conn = require('../../server/dbConnection')
const Course = conn.models.Course
const { ObjectId } = require('mongoose').Types

module.exports.createNewCourse = async (doc = {}) => {
	let docTemplate = {
		courseName: doc.courseName ? doc.courseName : 'Course Not Named',
		isTemplateCourse: doc.isTemplateCourse ? doc.isTemplateCourse : false,
		sections: doc.sections ? doc.sections : [],
		authors: doc.authors ? doc.authors : [],
		students: doc.students ? doc.students : [],
		settings: doc.settings ? doc.settings : {},
	}
	const course = new Promise(async (resolve, reject) => {
		try {
			const createdCourse = new Course(docTemplate)
			createdCourse.save()
			resolve(createdCourse)
		} catch (err) {
			reject(err)
		}
	})
	return course
}

// Add the section to a specific coures
// Returns Course Object with the new section added or err if no update
module.exports.pushNewSection = async (courseId, doc = {}) => {
	let docTemplate = {
		sectionName: doc.sectionName ? doc.sectionName : 'Unnamed section',
		isViewable: true ? doc.isViewable === 'true' || doc.isViewable : false,
		modules: doc.modules ? doc.modules : [],
	}
	const response = new Promise(async (resolve, reject) => {
		try {
			const res = await conn.models.Course.updateOne(
				{ id: ObjectId(courseId) },
				{ $push: { sections: docTemplate } }
			).exec()
			if (!res.modifiedCount) {
				reject({ msg: 'No course found to insert section' })
			}
			resolve(res)
		} catch (err) {
			console.log(err)
			reject(err)
		}
	})
	return response
}

module.exports.pushNewModule = async (couresId, sectionId, doc = {}) => {
	let docTemplate = {
		moduleName: doc.moduleName ? doc.ModuleName : 'Unnamed module',
		lectureDropDate: doc.lectureDropDate ? doc.lectureDropDate : null,
		isViewable: true ? doc.isViewable === 'true' || doc.isViewable : false,
		content: doc.content ? doc.content : [],
	}
	const response = new Promise(async (resolve, reject) => {
		try {
			const res = await conn.models.Course.updateOne(
				{
					id: ObjectId(couresId),
					'sections.id': ObjectId(sectionId),
				},
				{ $push: { 'sections.$.modules': docTemplate } }
			)
			if (!res.modifiedCount) {
				reject({ msg: 'No course found to insert section' })
			}
			resolve(res)
		} catch (err) {
			reject(err)
		}
	})
	return response
}
