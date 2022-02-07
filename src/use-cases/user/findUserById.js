require('dotenv').config({ path: '.env' })

module.exports = makeFindUserById = ({ User }) => {
	// Finds a user by an ObjectId
	// Resolve -> user document
	// Reject -> error
	return async function findUserById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const userDoc = await User.findById(id)
				if (userDoc == null) {
					return reject(ReferenceError('No user found in db'))
				}
				const found = userDoc.toObject()

				return resolve(found)
			} catch (error) {
				return reject(error)
			}
		})
	}
}
