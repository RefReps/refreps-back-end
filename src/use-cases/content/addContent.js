module.exports = makeAddContent = ({ Content }) => {
	// Save a new content in the db
	// Resolve -> content object
	// Reject -> error name
	return async function addContent(contentInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const content = new Content(contentInfo)
			try {
				const saved = await content.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
