const isEmptyObject = (object) => {
	return !Object.keys(object).length
}

const parser = async (doc, docParsingFunction) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isEmptyObject(doc)) throw new Error('Doc is empty')
			let newDoc = await docParsingFunction(doc)
			if (isEmptyObject(newDoc)) throw new Error('Nothing to parse')
			resolve(newDoc)
		} catch (error) {
			reject(error)
		}
	})
}

const parseUpdatableCourseDoc = async (doc) => {
	let newDoc = {}
	if (doc.courseName) {
		newDoc['courseName'] = doc.courseName
	}
	return newDoc
}

module.exports.parseValidCourseValues = async (doc = {}) => {
	return await parser(doc, parseUpdatableCourseDoc)
}
