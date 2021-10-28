const mongoose = require('mongoose')

// Create the connection to the mongodb
const conn = mongoose.createConnection()

// Create models from schemas for the conn object
conn.model('Content', require('../../schemas/content').contentSchema)
conn.model('Course', require('../../schemas/course').courseSchema)
conn.model('Module', require('../../schemas/module').moduleSchema)
conn.model('Section', require('../../schemas/section').sectionSchema)
conn.model('Setting', require('../../schemas/setting').settingSchema)
conn.model('User', require('../../schemas/user').userSchema)
conn.model('Video', require('../../schemas/video').videoSchema)

module.exports = conn
