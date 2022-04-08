require('dotenv').config({ path: '.env' })

module.exports = makeIsUserInSystem = ({ User }) => {
	// Finds a user by an email
	// Resolve -> true/false
	// Reject -> error
	return async function isUserInSystem(email) {
			try {
				const userDoc = await User.findOne({ email })
				if (userDoc == null) {
					return Promise.resolve(false)
				}

				return Promise.resolve(true)
			} catch (error) {
				return Promise.reject(error)
			}
	}
}
