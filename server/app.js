const express = require('express')
const session = require('express-session')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config({ path: '.env' })

// Initialize the express application
const app = express()
app.use(cors())
app.use(
	session({
		secret: process.env.TOKEN_SECRET,
		resave: false,
		saveUnitialized: false,
	})
)
app.use(express.static('public'))

// Import Routes
const indexRouter = require('../routers/index')
const courseRouter = require('../routers/courses')
const videoManagerRouter = require('../routers/videos')
const adminRouter = require('../routers/admin')
const authRouter = require('../routers/auth')

// Middleware
app.use(express.json())

// Route Middleware
app.use('/api', indexRouter)
app.use('/api/course', courseRouter)
app.use('/api/video', videoManagerRouter)
app.use('/api/admin', authRouter)
app.use('/api/user', authRouter)

module.exports = app
