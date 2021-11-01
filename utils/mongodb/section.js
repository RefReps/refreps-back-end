const conn = require('./dbConnection')
const Section = conn.models.Section
const { ObjectId } = require('mongoose').Types

module.exports.addNewSection = async (doc) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doc) return reject({ error: 'must include doc' })

			let section = new Section(doc)
			await section.save()
			return resolve(section)
		} catch (error) {
			return reject({ error: 'addNewSection could not save new section' })
		}
	})
}

module.exports.deleteSection = async (sectionId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!sectionId) return reject({ error: 'must include sectionId' })

			let deletedCount = await Section.deleteOne({ _id: sectionId }).exec()
			if (deletedCount['deletedCount'] === 0)
				return reject({ error: 'no section found to delete' })
			return resolve(deletedCount)
		} catch (error) {
			return reject({ error: 'deleteSection could not delete section' })
		}
	})
}

module.exports.getSectionsById = async (sectionIds = []) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (sectionIds.length === 0)
				return reject({ error: 'must include sectionIds' })

			let sections = await Section.find({ _id: { $in: sectionIds } }).exec()
			return resolve(sections)
		} catch (error) {
			return reject({ error: 'getSectionsById could not query sections' })
		}
	})
}

module.exports.updateSectionById = async (sectionId, updateDoc) => {
	return new Promise(async (resolve, reject) => {
		try {
			let updatedSection = await Section.findOneAndUpdate(
				{ _id: sectionId },
				updateDoc,
				{ upsert: false, new: true }
			)
			if (updatedSection === null)
				return reject({ error: 'No section found to update' })
			return resolve(updatedSection)
		} catch (error) {
			return reject({ error: 'cannot update section' })
		}
	})
}

module.exports.pushModuleIntoSection = async (sectionId, moduleId) => {
	// TODO: check to see if module exists
	return await this.updateSectionById(sectionId, {
		$addToSet: { modules: moduleId }, // addToSet for unique modules
	})
}

module.exports.getAllModulesInSectionBrief = async (sectionId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let modules = await Section.aggregate([
				{ $match: { _id: ObjectId(sectionId) } },
				{
					$lookup: {
						from: 'modules',
						localField: 'modules',
						foreignField: '_id',
						as: 'modulesObjects',
					},
				},
				{
					$project: {
						_id: 1,
						sectionName: 1,
						modulesObjects: 1,
					},
				},
			]).exec()
			return resolve(modules)
		} catch (error) {
			return reject({ error: 'cannot find modules' })
		}
	})
}
