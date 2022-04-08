module.exports = makeDeleteModule = ({ Module, Section, Content }) => {
	// Delete a module in the db
	// Resolve -> {deleted: #}
	// Rejects -> err.name
	return async function deleteModule(id) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }

			try {
				const module = await Module.findByIdAndDelete(id).exec()
				if (module == null) {
					return reject({ deleted: 0 })
				}

				// Remove module from section.modules
				const section = await Section.findByIdAndUpdate(
					module.sectionId,
					{ $pull: { modules: module._id } },
					options
				)

				// Delete all contents on the module
				const contents = await Content.deleteMany({
					moduleId: module._id,
				}).exec()

				return resolve({ deleted: 1 })
			} catch (err) {
				return reject(err)
			}
		})
	}
}
