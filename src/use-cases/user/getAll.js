module.exports = makeGetAll = ({ User }) => {
	// Finds all users
	// Resolve -> array of user documents
	// Reject -> error
	return async function getAll() {
		try {
			const users = await User.find({})
			if (users == null) {
				throw new ReferenceError('No users found in db')
			}
			const found = users.map((user) => user.toObject())

			const usersStripped = found.map((user) => {
				const {
					_id,
					firstName,
					lastName,
					email,
					role,
					authorCourses,
					studentCourses,
					createdAt,
				} = user
				return {
					_id,
					firstName,
					lastName,
					email,
					role,
					authorCourses,
					studentCourses,
					createdAt,
				}
			})

			return Promise.resolve({ users: usersStripped })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
