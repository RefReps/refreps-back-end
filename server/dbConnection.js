const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: __dirname + '/./../.env' })
const { db_connect } = require('../data/config.json')

// Create the connection to the mongodb
const conn = mongoose.createConnection()
conn.openUri(db_connect).catch((err) => {
	console.log('could not connect to db')
})

// Create models from schemas for the conn object
conn.model('Video', require('../schemas/video').videoSchema)
conn.model('User', require('../schemas/user').userSchema)
conn.model('Course', require('../schemas/course').courseSchema)

module.exports = conn
