const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const authorInfo = {
	userId: {
		type: ObjectId,
		required: true,
	},
}

const authorSchema = new Schema(authorInfo, {
	timestamps: true,
})

module.exports.authorSchema = authorSchema
module.exports.authorInfo = authorInfo
