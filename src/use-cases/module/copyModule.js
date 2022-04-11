module.exports = makeCopyModule = ({ Module, Section }) => {
	// Copy a module
	// Resolve -> module object
	// Reject -> error name
	return async function copyModule(moduleId, bindSectionId) {
		return new Promise(async (resolve, reject) => {
			try {
				const module = await Module.findById(moduleId)

				if (!module) {
					throw ReferenceError('Not Found')
				}

				const moduleInfo = Object.assign(
					{},
					{
						name: module.name,
						sectionId: bindSectionId,
						isPublished: module.isPublished,
						moduleOrder: module.moduleOrder,
						dropDate: module.dropDate,
					}
				)

				const copyModule = new Module(moduleInfo)

				const saved = await copyModule.save()

				// save the module id to the section
				const section = await Section.findOneAndUpdate(
					{ _id: bindSectionId },
					{ $push: { modules: saved._id } }
				)

				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
