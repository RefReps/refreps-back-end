const Announcement = require('../../database/models/announcement.model')

const makeAddAnnouncement = require('./addAnnouncement')
const makeCopyAnnouncement = require('./copyAnnouncement')
const makeFindAnnouncementById = require('./findAnnouncementById')
const makeUpdateAnnouncement = require('./updateAnnouncement')

const addAnnouncement = makeAddAnnouncement({ Announcement })
const copyAnnouncement = makeCopyAnnouncement({ Announcement })
const findAnnouncementById = makeFindAnnouncementById({ Announcement })
const updateAnnouncement = makeUpdateAnnouncement({ Announcement })

module.exports = {
	addAnnouncement,
	copyAnnouncement,
	findAnnouncementById,
	updateAnnouncement,
}
