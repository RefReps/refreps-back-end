const express = require('express')
require('dotenv').config({ path: '.env' })
const cors = require('cors')
const { postCourse } = require('./controllers/index')
const makeCallback = require('./express-callback/index')
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECT)

const app = express()
app.use(express.json())

app.use(cors())

// app.post('/api/course', makeCallback(postCourse))

// TESTING PUBLIC INDEX
app.use(express.static('public'))

// Require all routers
const contentRouter = require('./routers/content')
const courseRouter = require('./routers/course')
const moduleRouter = require('./routers/module')
const sectionRouter = require('./routers/section')
const videoRouter = require('./routers/video')

// Use Routers
app.use('/api/content', contentRouter)
app.use('/api/course', courseRouter)
app.use('/api/module', moduleRouter)
app.use('/api/section', sectionRouter)
app.use('/api/video', videoRouter)

app.listen(3000, () => {
	console.log('Server is listening on port 3000')
})
