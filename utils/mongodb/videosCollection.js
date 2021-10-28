const Video = require('./dbConnection').models.Video

// Creates a video document in the db
module.exports.createNewVideo = async (doc) => {
	return new Promise(async (resolve, reject) => {
		if (!doc) reject({ error: 'doc must be included' })
		try {
			const video = Video(doc)
			await video.save()
			resolve(video)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}

// Returns an array of all video documents
module.exports.getAllVideos = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			let doc = await Video.find({}).exec()
			resolve(doc)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}

// Returns a document of a video
module.exports.getVideoById = async (videoId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let doc = await Video.findById(videoId).exec()
			if (doc == null) throw new Error(`Video with id ${videoId} not found`)
			resolve(doc)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}

// Return a document of the deleted video
module.exports.deleteVideoById = async (videoId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let doc = await Video.findByIdAndDelete(videoId).exec()
			if (doc == null) throw new Error(`Video with id ${videoId} not found`)
			resolve(doc)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}
