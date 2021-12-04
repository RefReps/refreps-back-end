module.exports = makeFindVideoById = ({ Video }) => {
	// Finds a video by an ObjectId
	// Resolve -> {found: #, video: {object}}
	// Reject -> error
	return async function findVideoById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = {}

				const videoDoc = await Video.findById(id).where(query).exec()
				if (videoDoc == null) {
					throw new ReferenceError('Video not found in db')
				}
				const found = videoDoc.toObject()

				return resolve(found)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
