const conn = require('../server/dbConnection')
const ObjectId = require('mongoose').Types.ObjectId

let queryVideos = async (amount) => {
	let doc = new Promise(async (resolve, reject) => {
		try {
			let doc = await conn.models.Video.find().exec()
			doc = doc.map((element) => {
				return {
					title: element.title,
					url: element.url,
				}
			})
			resolve(doc)
		} catch (err) {
			reject({ msg: 'failed to query db' })
		}
	})
	return doc
}

let queryVideosType = async (type, limit) => {
	let payload = [
		{ $match: { types: type } },
		{ $sort: { _id: 1 } },
		{ $limit: limit },
		{ $project: { _id: 0, title: 1 } }, // choose what fields to send back
	]

	let doc
	try {
		doc = await querydb(payload)
	} catch (err) {
		doc = { err }
	}
	return doc
}

let queryById = async (id) => {
	let payload = [
		{ $match: { _id: ObjectId(id) } },
		{ $limit: 1 },
		{ $project: { _id: 0, title: 1 } },
	]
	let doc
	try {
		doc = await querydb(payload)
	} catch (err) {
		doc = { err }
	}
	return doc[0] // just returns 1 obj to remove array around 1 obj
}

let querydb = async (payloadArray) => {
	let doc = new Promise(async (resolve, reject) => {
		try {
			let doc = await conn.models.Video.aggregate(payloadArray).exec()
			resolve(doc)
		} catch (err) {
			reject({ msg: 'failed to query db' })
		}
	})
	return doc
}

module.exports.queryVideos = queryVideos
module.exports.queryVideosType = queryVideosType
module.exports.queryById = queryById
