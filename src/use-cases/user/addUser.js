// Encryption will most likely be `bcrypt`
module.exports = makeAddUser = ({ User, Encryption }) => {
	// Save a new user in the db
	// Resolve -> user object
	// Reject -> error name
	return async function addUser(userInfo = { email, password, role: 'user', firstName, lastName }) {
		return new Promise(async (resolve, reject) => {
			try {
				const userData = Object.assign({}, { ...userInfo })
				userData.password = await Encryption.hash(userInfo.password, 10)

				const user = new User(userData)

				const saved = await user.save()
				return resolve(saved.toObject())
			} catch (err) {
				return reject(err)
			}
		})
	}
}
