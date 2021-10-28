const Content = require('./dbConnection').models.Content

module.exports.createNewContent = async (doc) => {
	return new Promise(async (resolve, reject) => {
		if (!doc) reject({ error: 'doc must be included' })
		try {
			const content = Content(doc)
			await content.save()
			resolve(content)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}

module.exports.getAllContent = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			let doc = await Content.find({}).exec()
			resolve(doc)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}

module.exports.getContentById = async (contentId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let doc = await Content.findById(contentId).exec()
			if (doc == null) throw new Error(`Content with id ${contentId} not found`)
			resolve(doc)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}

// Returns the updated content document
module.exports.updateContentById = async (contentId, update) => {
	const options = { new: true, runValidators: true }
	return new Promise(async (resolve, reject) => {
		if (!contentId) reject({ error: 'contendId must be passed' })
		if (!update) reject({ error: 'update document must be passed' })
		try {
			let doc = await Content.findByIdAndUpdate(
				contentId,
				update,
				options
			).exec()
			if (doc == null) throw new Error(`Content with id ${contentId} not found`)
			resolve(doc)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}

module.exports.deleteContentById = async (contentId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!contentId) reject({ msg: 'contentId must be passed' })
			let doc = await Content.findByIdAndDelete(contentId).exec()
			if (doc == null) throw new Error(`Content with id ${contentId} not found`)
			resolve(doc)
		} catch (err) {
			reject({ error: err.toString() })
		}
	})
}
