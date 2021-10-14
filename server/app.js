const express = require('express')
const path = require('path')
require('dotenv').config({ path: __dirname + '/./../.env' })

const app = express()

const indexRouter = require('../routers/index')
const courseRouter = require('../routers/courses')

app.use('', indexRouter)
app.use('/courses', courseRouter)

module.exports = app
