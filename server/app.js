const express = require('express')
const session = require('express-session')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config({ path: __dirname + '/./../.env' })

// Initialize the express application
const app = express()
app.use(cors())
app.use(
	session({
		secret: 'secret-key',
		resave: false,
		saveUnitialized: false,
	})
)

// Add endpoints to the application
const indexRouter = require('../routers/index')
const courseRouter = require('../routers/courses')
const videoManagerRouter = require('../routers/videos')

app.use('/api', indexRouter)
app.use('/api/courses', courseRouter)
app.use('/api/videos', videoManagerRouter)

module.exports = app
