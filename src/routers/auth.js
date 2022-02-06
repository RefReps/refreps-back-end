const router = require('express').Router()
const multer = require('multer')()

const useCases = require('../use-cases/index')

// temp import of User model
const User = require('../database/models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router
	.route('/token-login')
	// request -> {refresh_token, email}
	// response -> {success, access_token, refresh_token}
	.post(async (req, res) => {})

router
	.route('/login')
	// TODO: Integrate with REFREP's current user database for logging in
	// request -> req.body {email, password}
	// response -> {success, access_token, refresh_token}
	.post(multer.none(), async (req, res) => {
		try {
			const { email, password } = req.body
			const user = await getUserByEmail(email)

			if (user && (await compareEncrypted(password, user.password))) {
				const { access_token, refresh_token } = await generateUserTokens(email)
				return res.status(200).json({
					success: true,
					access_token,
					refresh_token,
					userRole: user.role,
				})
			}

			throw new Error('Failed to login')
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

router
	.route('/register')
	// temporary route for mainly testing purposes
	// request -> req.body {email, password}
	// response -> {success, access_token, refresh_token}
	.post(multer.none(), async (req, res) => {
		try {
			const { email, password } = req.body
			await createUser({ email, password })
			const { access_token, refresh_token } = await generateUserTokens(email)
			return res.status(200).json({
				success: true,
				access_token,
				refresh_token,
				userRole: getUserByEmail(email).role,
			})
		} catch (error) {
			res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

router
	.route('/refresh-token')
	// Refresh the access token based on the refresh token
	// request: {email, refresh_token}
	.post(multer.none(), async (req, res) => {
		try {
			let { email, refresh_token } = req.body
			if (!refresh_token) {
				return res
					.status(400)
					.json({ success: false, reason: 'A refresh token was not provided' })
			}
			if (!verifyRefresh(email, refresh_token)) {
				return res.status(401).json({
					success: false,
					reason: 'Invalid token, try loggin in again',
				})
			}

			if (!(await checkRefreshTokenOnUser(email, refresh_token))) {
				return res.status(401).json({
					success: false,
					reason: 'Invalid token, try loggin in again',
				})
			}

			const tokens = await generateUserTokens(email)
			await removeRefreshToken(email, refresh_token)
			await pushRefreshTokenOnUser(email, tokens.refresh_token)

			return res.status(200).json({
				success: true,
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
			})
		} catch (error) {
			return res
				.status(400)
				.json({ success: false, error: error.name, reason: error.message })
		}
	})

const { isAuthenticated } = require('../utils/middleware/auth')
router.route('/test-auth').get(isAuthenticated, (req, res) => {
	try {
		return res.status(204).send()
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, error: error.name, reason: error.reason })
	}
})

// temp user control

const createUser = async (data) => {
	try {
		const user = new User(await parseUserData(data))
		await user.save()
		return Promise.resolve(user)
	} catch (error) {
		return Promise.reject(error)
	}
}

const parseUserData = async (data) => {
	return {
		// firstName: data.firstName,
		// lastName: data.lastName,
		email: data.email,
		password: await encryptString(data.password),
	}
}

const getUserByEmail = async (email) => {
	try {
		const user = await User.findOne({ email })
		return Promise.resolve(user)
	} catch (error) {
		return Promise.reject(error)
	}
}

const checkRefreshTokenOnUser = async (email, token) => {
	try {
		const user = await User.findOne({ email })
		if (user.refreshTokens.includes(token)) {
			return true
		}
	} catch (error) {
		return error
	}
	return false
}

const removeRefreshToken = async (email, token) => {
	try {
		const user = await User.findOneAndUpdate(
			{ email },
			{ $pull: { refreshTokens: token } }
		)
		return true
	} catch (error) {
		return error
	}
}

const pushRefreshTokenOnUser = async (email, token) => {
	try {
		await User.findOneAndUpdate({ email }, { $push: { refreshTokens: token } })
		return Promise.resolve(true)
	} catch (error) {
		return Promise.reject(error)
	}
}

const compareEncrypted = async (str, hashed) => {
	return await bcrypt.compare(str, hashed)
}

const encryptString = async (str) => {
	return await bcrypt.hash(str, 10)
}

const generateUserTokens = async (email) => {
	const access_token = generateToken({ email }, 1000 * 60 * 3)
	const refresh_token = generateToken({ email }, '1d')
	await pushRefreshTokenOnUser(email, refresh_token)
	return { access_token, refresh_token }
}

const generateToken = (data, expiresIn) => {
	return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn })
}

const verifyToken = (token) => {
	let valid = false
	try {
		if (jwt.verify(token, process.env.TOKEN_SECRET)) {
			valid = true
		}
	} catch (error) {
		valid = false
	}
	return valid
}

const verifyRefresh = (email, token) => {
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
		return decoded.email === email
	} catch (error) {
		return false
	}
}

module.exports = router
