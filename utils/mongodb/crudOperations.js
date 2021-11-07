const conn = require('./dbConnection')

const { Course, Video } = conn.models

const modelInfo = {
	course: {
		model: Course,
		path: '',
		arrayFilters: function () {
			return []
		},
		requiredIds: 1,
	},
	section: {
		model: Course,
		path: 'sections.$[section]',
		delPath: 'sections',
		arrayFilters: function (sectionId) {
			return [{ 'section._id': sectionId }]
		},
		requiredIds: 2,
	},
	module: {
		model: Course,
		path: 'sections.$[section].modules.$[module]',
		delPath: 'sections.$[section].modules',
		arrayFilters: function (sectionId, moduleId) {
			return [{ 'section._id': sectionId }, { 'module._id': moduleId }]
		},
		requiredIds: 3,
	},
	content: {
		model: Course,
		path: 'sections.$[section].modules.$[module].content.$[content]',
		delPath: 'sections.$[section].modules.$[module].content',
		arrayFilters: function (sectionId, moduleId, contentId) {
			return [
				{ 'section._id': sectionId },
				{ 'module._id': moduleId },
				{ 'content._id': contentId },
			]
		},
		requiredIds: 4,
	},
	video: {
		model: Video,
		path: '',
		arrayFilters: function () {
			return []
		},
		requiredIds: 1,
	},
}

const constructSetUpdateFields = (doc, updatePath) => {
	let setUpdateObj = {}
	Object.entries(doc).forEach(([key, val]) => {
		if (updatePath === '') {
			setUpdateObj[key] = val
		} else {
			setUpdateObj[`${updatePath}.${key}`] = val
		}
	})
	return setUpdateObj
}

// Updates a doc in the database.
// A modelName being passed must be valid in the modelInfo above.
module.exports.updateDoc = (modelName = '', doc, ...ids) => {
	return new Promise(async (resolve, reject) => {
		try {
			modelName = modelName.toLowerCase()
			if (!(modelName in modelInfo))
				throw new Error(`Model '${modelName}' not found.`)

			if (!(ids.length === modelInfo[modelName].requiredIds))
				throw new Error(
					`'${modelName}' requires '${modelInfo[modelName].requiredIds}' ids. Provided '${ids.length}'`
				)

			const id1 = ids.shift() // Remove the first id
			const model = modelInfo[modelName].model
			const path = modelInfo[modelName].path
			const arrayFilters = modelInfo[modelName].arrayFilters.apply(null, ids) // Use the rest of the ids in the filters
			let updatedDoc = await model.findByIdAndUpdate(
				{ _id: id1 },
				{ $set: constructSetUpdateFields(doc, path) },
				{ arrayFilters: arrayFilters, new: true }
			)

			if (updatedDoc === null) throw new Error('No doc found to update')

			resolve(updatedDoc)
		} catch (error) {
			reject(error)
		}
	})
}

module.exports.deleteNestedDoc = (modelName = '', ...ids) => {
	return new Promise(async (resolve, reject) => {
		try {
			modelName = modelName.toLowerCase()
			if (!(modelName in modelInfo))
				throw new Error(`Model '${modelName}' not found.`)

			if (!(ids.length === modelInfo[modelName].requiredIds))
				throw new Error(
					`'${modelName}' requires '${modelInfo[modelName].requiredIds}' ids. Provided '${ids.length}'`
				)

			const id1 = ids.shift() // Remove the first id
			const model = modelInfo[modelName].model
			const delPath = modelInfo[modelName].delPath
			const arrayFilters = modelInfo[modelName].arrayFilters.apply(null, ids) // Use the rest of the ids in the filters

			let deleteObj = {}
			deleteObj[delPath] = { _id: ids[ids.length - 1] }
			console.log(
				{ _id: id1 },
				{ $pull: deleteObj },
				{ arrayFilters: arrayFilters, new: true }
			)
			let updatedDoc = await model.findByIdAndUpdate(
				{ _id: id1 },
				{ $pull: deleteObj },
				{ arrayFilters: arrayFilters, new: true }
			)

			if (updatedDoc === null) throw new Error('No doc found to update')

			resolve(updatedDoc)
		} catch (error) {
			reject(error)
		}
	})
}
