const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const studentInfo = {
	userId: {
		type: ObjectId,
		required: true,
	},
}

const studentSchema = new Schema(studentInfo, {
	timestamps: true,
})

module.exports.studentSchema = studentSchema
module.exports.studentInfo = studentInfo
