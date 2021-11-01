const conn = require('./dbConnection')
const Module = conn.models.Module

module.exports.addNewModule = async (doc) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doc) reject({ error: 'must include doc' })

			let module = new Module(doc)
			await module.save()
			return resolve(module)
		} catch (error) {
			return reject({ error: 'addNewModule could not save new module' })
		}
	})
}

module.exports.deleteModule = async (moduleId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!moduleId) reject({ error: 'must include moduleId' })

			let deletedCount = await Module.deleteOne({ _id: moduleId }).exec()
			if (deletedCount['deletedCount'] === 0)
				return reject({ error: 'no module found to delete' })
			return resolve(deletedCount)
		} catch (error) {
			return reject({ error: 'deleteModule could not delete module' })
		}
	})
}

module.exports.getModulesById = async (moduleIds = []) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (moduleIds.length === 0) reject({ error: 'must include moduleIds' })
			let modules = await Module.find({ _id: { $in: moduleIds } }).exec()
			return resolve(modules)
		} catch (error) {
			return reject({ error: 'getModulesById could not query modules' })
		}
	})
}

module.exports.updateModuleById = async (moduleId, updateDoc) => {
	return new Promise(async (resolve, reject) => {
		try {
			let updatedModule = await Module.findOneAndUpdate(
				{ _id: moduleId },
				updateDoc,
				{ upsert: false, new: true }
			)
			if (updatedModule === null)
				return reject({ error: 'No module found to update' })
			return resolve(updatedModule)
		} catch (error) {
			return reject({ error: 'cannot update module' })
		}
	})
}

module.exports.pushContentIntoModule = async (moduleId, contentId) => {
	// TODO: check to see if content exists
	return await this.updateCourseById(moduleId, {
		$addToSet: { content: contentId }, // addToSet for unique content
	})
}
