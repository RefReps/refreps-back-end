module.exports = makeFindAnnouncementById = ({ Announcement }) => {
    // Resolve -> announcement object
    // Reject -> error name
    return async function findAnnouncementById(announcementId) {
        try {
            const announcement = await Announcement.findById(announcementId)
            return Promise.resolve({ announcement })
        } catch (err) {
            return Promise.reject(err)
        }
    }
}