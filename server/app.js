const express = require('express')
const upload = require('multer')()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config({ path: '.env' })

// Initialize the express application
const app = express()

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// for parsing multipart/form-data
// app.use(upload.none())
app.use(express.static('public'))

app.use(cors())

// Import Routes
const courseRouter = require('../routers/courses')
const videoManagerRouter = require('../routers/videos')

// Route Middleware
app.use('/api/course', courseRouter)
app.use('/api/video', videoManagerRouter)

module.exports = app
