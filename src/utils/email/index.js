const gmailStrategy = require('./gmailStrategy')

require('dotenv').config({ path: '.env' })

// Strategy types for transporter
let TRANSPORTER_STRATEGY = {
	GMAIL: 'GMAIL',
}
module.exports.TRANSPORTER_STRATEGY = TRANSPORTER_STRATEGY

// function that generates name from email
const generateFromEmail = (email) => {
	try {
		const name = email.split('@')[0]
		return `${name} <${email}>`
	} catch (error) {
		return ''
	}
}

const getTransporterStrategy = (strategyType) => {
	switch (strategyType) {
		case TRANSPORTER_STRATEGY.GMAIL:
			return gmailStrategy.transporter
		default:
			return undefined
	}
}

const generateMailDetails = (strategyType) => {
	switch (strategyType) {
		case TRANSPORTER_STRATEGY.GMAIL:
			return gmailStrategy.generateMailDetails()
		default:
			return undefined
	}
}

// Returns a promise that resolves or rejects
module.exports.sendEmailCourseLinkToExistingUser = async ({
	email = '',
	courseObj = {},
	transport_strategy = TRANSPORTER_STRATEGY.GMAIL,
}) => {
	// check if email is valid
	if (!email) {
		return Promise.reject(new Error('Email is not valid'))
	}

	// check if transport strategy is supported
	if (
		!getTransporterStrategy(transport_strategy) ||
		!generateMailDetails(transport_strategy)
	) {
		return Promise.reject(
			new Error(`Transport strategy ${transport_strategy} is not supported`)
		)
	}

	// load transporter strategy
	const transporter = getTransporterStrategy(transport_strategy)
	const mailDetails = Object.assign(generateMailDetails(transport_strategy), {
		from: '"Refreps" <do-not-reply@gmail.com>',
		to: generateFromEmail(email),
	})
	mailDetails.subject = `REFREPS: Course Added - ${courseObj.name || ''}`
	mailDetails.text = `
	You have been added to the course: ${courseObj.name || ''}.
	Click on the link below to view your courses.

	${process.env.FRONTEND_URL}/courses
	`

	// send email
	let info = await transporter.sendMail(mailDetails)
	return Promise.resolve(info)
}

module.exports.sendEmailCourseLinkToNewUser = async ({
	email = '',
	courseObj = {},
	transport_strategy = TRANSPORTER_STRATEGY.GMAIL,
}) => {
	// check if email is valid
	if (!email) {
		return Promise.reject(new Error('Email is not valid'))
	}

	// check if transport strategy is supported
	if (
		!getTransporterStrategy(transport_strategy) ||
		!generateMailDetails(transport_strategy)
	) {
		return Promise.reject(
			new Error(`Transport strategy ${transport_strategy} is not supported`)
		)
	}

	// load transporter strategy
	const transporter = getTransporterStrategy(transport_strategy)
	const mailDetails = Object.assign(generateMailDetails(transport_strategy), {
		from: '"Refreps" <do-not-reply@gmail.com>',
		to: generateFromEmail(email),
		subject: 'REFREPS: Course Invitation',
	})

	// check if courseObj.studentCourseCode exists
	if (courseObj.studentCourseCode) {
		mailDetails.text = `
		You have been invited to join the course: ${courseObj.name || ''}.
		Please click on the link below to register and join the course.

		${process.env.FRONTEND_URL}/join/${courseObj.studentCourseCode.code}
		`
	} else {
		mailDetails.text = `
		You have been invited to join the course: ${courseObj.name || ''}.
		Please register an account and contact your instructor to join the course.
		`
	}

	// send email
	let info = await transporter.sendMail(mailDetails)
	return Promise.resolve(info)
}
