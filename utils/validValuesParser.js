// Check if an object is empty
const isEmptyObject = (object) => {
	return !Object.keys(object).length
}

// Copy values to a new array that are allowed in the doc
const copyValidValues = async (doc, validKeys) => {
	let newDoc = {}
	validKeys.forEach((key) => {
		if (doc.hasOwnProperty(key)) {
			newDoc[key] = doc[key]
		}
	})
	return newDoc
}

// Return a promise that contains valid values
// Resolves a new object that has parsed key-value pairs based on the validKeys
// Param doc - Object: key-value pairs
// Param validKeys - string[]: valid keys to allow in the new object
module.exports.parseValidValues = async (doc = {}, validKeys = ['']) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isEmptyObject(doc)) throw new Error('Doc is empty')

			let newDoc = await copyValidValues(doc, validKeys)
			if (isEmptyObject(newDoc)) throw new Error('Nothing to parse')
			resolve(newDoc)
		} catch (error) {
			reject(error)
		}
	})
}

module.exports.validKeys = {
	validCourseKeys: ['courseName'],
	validSectionKeys: ['sectionName', 'orderInCourse', 'isViewable'],
	validModuleKeys: [
		'moduleName',
		'orderInSection',
		'lectureDropDate',
		'isViewable',
	],
	validContentKeys: [],
	validVideoKeys: [
		'fieldname',
		'originalname',
		'encoding',
		'mimetype',
		'destination',
		'filename',
		'path',
		'size',
	],
}
