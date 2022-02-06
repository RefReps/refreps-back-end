module.exports = makeRemoveRefreshToken = ({ User }) => {
	// Updates an existing user
	// Resolve -> updated user document
	// Rejects -> error

	// NOTE: this function does not ensure any specific parts of the user are
	// not updated. That is handled inside of the controller that uses this function.
	return async function removeRefreshToken(id, token) {
		return new Promise(async (resolve, reject) => {
			const options = { returnDocument: 'after' }
			try {
				if (!id) {
					throw new ReferenceError('`id` is required to update')
				}

				const updated = await User.findByIdAndUpdate(
					id,
					{ $pull: { refreshTokens: token } },
					options
				).exec()
				if (updated == null) {
					throw ReferenceError('User not found')
				}
				return resolve(updated.toObject())
			} catch (error) {
				return reject(error)
			}
		})
	}
}
