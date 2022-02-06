module.exports = makeCompareRefreshToken = ({ User }) => {
	// Checks if token is in user
	// Resolve -> boolean
	// Reject -> error
	return async function compareRefreshToken(email, token) {
		return new Promise(async (resolve, reject) => {
			try {
				const userDoc = await User.findOne({ email })
				if (userDoc == null) {
					return reject(ReferenceError('No user found in db'))
				}

				if (userDoc.refreshToken.includes(token)) {
					return resolve(true)
				}
				return resolve(false)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
