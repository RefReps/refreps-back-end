const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: __dirname + '/./../.env' })

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME

const uri = process.env.DB_CONNECT

// Create the connection to the mongodb
const conn = mongoose.createConnection()
conn.openUri(uri).catch((err) => {
	console.log('could not connect to db')
})

// Create models from schemas for the conn object
conn.model('Video', require('../schemas/video').videoSchema)
conn.model('User', require('../schemas/user').userSchema)
conn.model('Course', require('../schemas/course').courseSchema)

module.exports = conn
