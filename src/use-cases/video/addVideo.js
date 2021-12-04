module.exports = makeAddVideo = ({ Video }) => {
	// Save a new video doc in the db
	// Resolve -> video Object
	// Rejects -> error
	return async function addVideo(videoInfo = {}) {
		return new Promise(async (resolve, reject) => {
			const video = new Video(videoInfo)
			try {
				const saved = await video.save()
				return resolve(saved.toObject())
			} catch (error) {
				return reject(error)
			}
		})
	}
}
