const express = require('express')
require('dotenv').config({ path: '.env' })
const cors = require('cors')
const mongoose = require('mongoose')

// Connect to mongodb
mongoose
	.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
	.then(() => console.log(`MongoDB Connected: ${process.env.DB_CONNECT}`))
	.catch((error) => console.log(error))

if (!require('./utils/checkEnvFile').checkAllCriticalEnvVariablesExists()) {
	console.log('Server refused to start.\nExiting...')
	process.exit(1)
}

// Create Uploads dir if needed
const {
	checkIfLocalUploadDir,
	createLocalUploadDir,
} = require('./utils/createUploadsDir')
if (!checkIfLocalUploadDir()) {
	createLocalUploadDir()
}

const app = express()
app.use(express.json())

app.use(cors())

// app.post('/api/course', makeCallback(postCourse))

// TESTING PUBLIC INDEX
app.use(express.static('public'))

// Require all routers
const authRouter = require('./routers/auth')
const contentRouter = require('./routers/content')
const courseRouter = require('./routers/course')
const moduleRouter = require('./routers/module')
const quizRouter = require('./routers/quiz')
const sectionRouter = require('./routers/section')
const videoRouter = require('./routers/video')

// Use Routers
app.use('/api/auth', authRouter)
app.use('/api/content', contentRouter)
app.use('/api/course', courseRouter)
app.use('/api/module', moduleRouter)
app.use('/api/quiz', quizRouter)
app.use('/api/section', sectionRouter)
app.use('/api/video', videoRouter)

app.listen(3000, () => {
	console.log('Server is listening on port 3000')
})
