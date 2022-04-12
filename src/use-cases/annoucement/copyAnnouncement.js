module.exports = makeCopyAnnouncement = ({ Announcement }) => {
	return async function copyAnnouncement(announcementId) {
		try {
			const oldAnnouncement = await Announcement.findById(announcementId)

			if (!oldAnnouncement)
				throw ReferenceError('Announcement not found to copy.')

			const newAnnouncement = new Announcement({
				title: oldAnnouncement.title,
				body: oldAnnouncement.body,
			})
			await newAnnouncement.save()

			return Promise.resolve({ announcement: newAnnouncement.toObject() })
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
