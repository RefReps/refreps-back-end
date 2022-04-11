// mongoose model for announcement
const { Schema, model, Types } = require('mongoose')

const announcementSchema = new Schema(
	{
		title: {
			type: String,
			defualt: 'Announcement',
			required: true,
		},
		body: {
			type: String,
			default: 'Announcement content',
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = model('Announcement', announcementSchema)
