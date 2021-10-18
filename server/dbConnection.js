const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: __dirname + '/./../.env' })

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME

const uri = `mongodb://${dbHost}:${dbPort}/${dbName}`

// Create the connection to the mongodb
const conn = mongoose.createConnection()
conn.openUri(uri)

// Create models from schemas for the conn object
conn.model('Video', require(path.join(__dirname, '/./../schemas/video')))

module.exports = conn
