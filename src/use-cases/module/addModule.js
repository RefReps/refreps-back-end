module.exports = makeAddModule = ({ Module, Section }) => {
	// Save a new module in the db
	// Resolve -> module object
	// Reject -> error
	return async function addModule(moduleInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }

			const module = new Module(moduleInfo)
			try {
				// Add module to section.modules
				const section = await Section.findByIdAndUpdate(
					moduleInfo.sectionId,
					{
						$push: { modules: module._id },
					},
					options
				)
				if (section == null) {
					throw ReferenceError('Section not found.')
				}

				const saved = await module.save()
				return resolve(saved.toObject())
			} catch (error) {
				return reject(error)
			}
		})
	}
}
