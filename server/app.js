const express = require('express')
const upload = require('multer')()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config({ path: '.env' })
const { token_secret } = require('../data/config.json')

// Initialize the express application
const app = express()

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// for parsing multipart/form-data
app.use(upload.none())
app.use(express.static('public'))

app.use(cors())

// Import Routes
const indexRouter = require('../routers/index')
const courseRouter = require('../routers/courses')
const videoManagerRouter = require('../routers/videos')
const adminRouter = require('../routers/admin')
const authRouter = require('../routers/auth')

// Route Middleware
app.use('/api', indexRouter)
app.use('/api/course', courseRouter)
app.use('/api/video', videoManagerRouter)
app.use('/api/admin', authRouter)
app.use('/api/user', authRouter)

module.exports = app
