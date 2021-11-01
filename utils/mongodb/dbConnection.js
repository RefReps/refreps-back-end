const mongoose = require('mongoose')

// Create the connection to the mongodb
const conn = mongoose.createConnection()

// Create models from schemas for the conn object
conn.model('Content', require('../../schemas/content').contentSchema)
conn.model('Course', require('../../schemas/course').courseSchema)
conn.model('User', require('../../schemas/user').userSchema)
conn.model('Video', require('../../schemas/video').videoSchema)

module.exports = conn
