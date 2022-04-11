// update an announcement
module.exports = makeUpdateAnnouncement = ({ Announcement }) => {
	// Update an announcement in the db
	// Resolve -> announcement object
	// Reject -> error name
	return async function updateAnnouncement(id, announcementInfo = {}) {
		try {
			const options = { returnDocument: 'after' }
			const announcement = await Announcement.findByIdAndUpdate(
				id,
				announcementInfo,
				options
			)
			return Promise.resolve({ announcement: announcement.toObject() })
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
