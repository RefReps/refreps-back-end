const express = require('express')
require('dotenv').config({ path: '.env' })
const { postCourse } = require('./controllers/index')
const makeCallback = require('./express-callback/index')
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URI)

const app = express()
app.use(express.json())

app.post('/api/course', makeCallback(postCourse))

app.listen(3000, () => {
	console.log('Server is listening on port 3000')
})
