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
conn.model('Video', require(path.join(__dirname, '/./../schemas/video')))
conn.model('User', require(path.join(__dirname, '/./../schemas/user')))

module.exports = conn
