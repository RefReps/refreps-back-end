module.exports = makeAddSection = ({ Section }) => {
	// Save a new section in the db
	// Resolve -> section object
	// Reject -> error name
	return async function addSection(sectionInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const section = new Section(sectionInfo)
			try {
				const saved = await section.save()
				return resolve(saved)
			} catch (err) {
				return reject(err)
			}
		})
	}
}
