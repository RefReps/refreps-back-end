const express = require('express')
const path = require('path')
require('dotenv').config({ path: __dirname + '/./../.env' })

const app = express()

app.get('/', (req, res) => {
	res.json({ msg: 'server root' })
})

module.exports = app
