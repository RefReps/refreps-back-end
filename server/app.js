const express = require('express')
const upload = require('multer')()
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
const contentRouter = require('../routers/contents')
const courseRouter = require('../routers/courses')
const moduleRouter = require('../routers/modules')
const sectionRouter = require('../routers/sections')
const videoRouter = require('../routers/videos')

// Route Middleware
app.use('/api/content', contentRouter)
app.use('/api/course', courseRouter)
app.use('/api/module', moduleRouter)
app.use('/api/section', sectionRouter)
app.use('/api/video', videoRouter)

module.exports = app
