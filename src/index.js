const express = require('express')
require('dotenv').config({ path: '.env' })
const { postCourse } = require('./controllers/index')
const makeCallback = require('./express-callback/index')
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECT)

const app = express()
app.use(express.json())

// app.post('/api/course', makeCallback(postCourse))

// Require all routers
const courseRouter = require('./routers/course')
const moduleRouter = require('./routers/module')
const sectionRouter = require('./routers/section')

// Use Routers
app.use('/api/course', courseRouter)
app.use('/api/module', moduleRouter)
app.use('/api/section', sectionRouter)

app.listen(3000, () => {
	console.log('Server is listening on port 3000')
})
