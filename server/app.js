const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: '.env' })

// Make sure that the env file critical variables are populated with values
if (!require('../utils/checkEnvFile').checkAllCriticalEnvVariablesExists()) {
	console.log('Server refused to start')
	process.exit(1)
}

// Initialize the express application
const app = express()

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// for parsing multipart/form-data
app.use(express.static('public'))

app.use(cors())

// Import Routes
const courseRouter = require('../routers/courses')
const videoRouter = require('../routers/videos')

// Route Middleware
app.use('/api/course', courseRouter)
app.use('/api/video', videoRouter)

module.exports = app
