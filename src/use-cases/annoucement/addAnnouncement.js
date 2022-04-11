// Add an announcement
module.exports = makeAddAnnouncement = ({ Announcement }) => {
	// Save a new announcement in the db
	// Resolve -> announcement object
	// Reject -> error name
	return async function addAnnouncement(announcementInfo = {}) {
		try {
			const announcement = new Announcement({
				title: 'New Announcement',
				body: 'Announcement content',
				...announcementInfo,
			})
			await announcement.validate()

			const saved = await announcement.save()
			return Promise.resolve({ announcement: saved.toObject() })
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
