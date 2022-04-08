const nodemailer = require('nodemailer')
require('dotenv').config({ path: '.env' })

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		type: 'OAuth2',
		clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
		clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	},
})

module.exports.generateMailDetails = () => {
	return {
		from: '',
		to: '',
		subject: '',
		text: '',
		auth: {
			user: process.env.GOOGLE_USER,
			refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
			accessToken: '',
			expires: 36000,
		},
	}
}

module.exports.transporter = transporter
