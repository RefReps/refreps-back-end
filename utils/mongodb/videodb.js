const Video = require('./dbConnection').models.Video

// Creates a new video doc in the videos collection
// Resolves the video doc as an object
// Rejects error
module.exports.saveNewVideo = async (doc) => {
	return new Promise(async (resolve, reject) => {
		try {
			const video = Video(doc)
			await video.save()
			resolve(video)
		} catch (error) {
			reject(error)
		}
	})
}

// Returns an array of all video documents
module.exports.getAllVideos = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			let videosDocs = await Video.find({}).exec()
			resolve(videosDocs)
		} catch (error) {
			reject(error)
		}
	})
}

// Returns a document of a video
module.exports.getVideoById = async (videoId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let videoDoc = await Video.findById(videoId).exec()
			resolve(videoDoc)
		} catch (error) {
			reject(error)
		}
	})
}

// Return a document of the deleted video
module.exports.deleteVideoById = async (videoId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let videoDoc = await Video.findByIdAndDelete(videoId).exec()
			resolve(videoDoc)
		} catch (error) {
			reject(error)
		}
	})
}
