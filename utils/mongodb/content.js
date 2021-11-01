const conn = require('./dbConnection')
const Content = conn.models.Content
const { ObjectId } = require('mongoose').Types

module.exports.addNewContent = async (doc) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doc) return reject({ error: 'must include doc' })

			let content = new Content(doc)
			await content.save()
			return resolve(content)
		} catch (error) {
			console.log(error)
			return reject({ error: 'addNewContent could not save new content' })
		}
	})
}

module.exports.deleteContent = async (contentId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!contentId) return reject({ error: 'must inlcude contentId' })

			let deletedCount = await Content.deleteOne({ _id: contentId }).exec()
			if (deletedCount['deletedCount'] === 0)
				return reject({ error: 'no content found to delete' })
			return resolve(deletedCount)
		} catch (error) {
			return reject({ error: 'deleteContent could not delete content' })
		}
	})
}

module.exports.getContentsById = async (contentIds = []) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (contentIds.length === 0)
				return reject({ error: 'must include contentIds' })

			let contents = await Content.find({ _id: { $in: contentIds } }).exec()
			return resolve(contents)
		} catch (error) {
			return reject({
				error: 'getContentsById could not query contents',
			})
		}
	})
}

module.exports.updateContentById = async (contentId, updateDoc) => {
	return new Promise(async (resolve, reject) => {
		try {
			let updatedContent = await Content.findOneAndUpdate(
				{ _id: contentId },
				updateDoc,
				{ upsert: false, new: true }
			)
			if (updatedContent === null)
				return reject({ error: 'No content found to update' })
			return resolve(updatedContent)
		} catch (error) {
			return reject({ error: 'cannot update content' })
		}
	})
}

module.exports.linkTypeToContent = async (
	contentId = '',
	contentInOtherCollectionId = '',
	contentType = ''
) => {
	// TODO: check to see if the external content exists
	return await this.updateContentById(contentId, {
		toContent: contentInOtherCollectionId,
		contentType: contentType.toLowerCase(),
	})
}

// module.exports.getAllMaterialsInContentBrief = async (contentId) => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			let sections = await Content.aggregate([
// 				{ $match: { _id: ObjectId(contentId) } },
// 				{
// 					$lookup: {
// 						from: 'sections',
// 						localField: 'sections',
// 						foreignField: '_id',
// 						as: 'sectionsObjects',
// 					},
// 				},
// 				{
// 					$project: {
// 						_id: 1,
// 						contentName: 1,
// 						sectionsObjects: 1,
// 					},
// 				},
// 			]).exec()
// 			return resolve(sections)
// 		} catch (error) {
// 			return reject({ error: 'cannot find sections' })
// 		}
// 	})
// }
