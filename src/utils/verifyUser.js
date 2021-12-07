const conn = require('../../server/dbConnection')
require('dotenv').config({ path: '.env' })

module.exports.admin = async (req, res, next) => {
	if (process.env.ENVIRONMENT.toLowerCase() == 'dev') {
		next()
		return
	}

	let user = await conn.models.User.findOne({ _id: req.user }).exec()
	if (!user.isAdmin) {
		return res.status(401).send('Access Denied: Admins Only')
	}
	next()
}

module.exports.sales = async (req, res, next) => {
	if (process.env.ENVIRONMENT.toLowerCase() == 'dev') {
		next()
		return
	}

	let user = await conn.models.User.findOne({ _id: req.user }).exec()
	if (user.isAdmin) {
		return next()
	}

	if (!user.isSales) {
		return res.status(401).send('Access Denied: Sales Only')
	}
	next()
}

module.exports.author = async (req, res, next) => {
	if (process.env.ENVIRONMENT.toLowerCase() == 'dev') {
		next()
		return
	}

	let user = await conn.models.User.findOne({ _id: req.user }).exec()
	if (user.isAdmin) {
		return next()
	}

	if (!user.isAuthor) {
		return res.status(401).send('Access Denied: Authors Only')
	}
	next()
}
