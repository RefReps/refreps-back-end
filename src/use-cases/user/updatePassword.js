// update password for a user
module.exports = makeUpdatePassword = ({ User, Encryption }) => {
    // Updates a user's password
    // Resolve -> user document
    // Reject -> error
    return async function updatePassword(id, password) {
        try {
            // Hash the password
            const hashedPassword = await Encryption.hash(password, 10)

            // Update the user's password
            const options = { returnDocument: 'after' }
            const user = await User.findByIdAndUpdate(
                id,
                { password: hashedPassword },
                options
            )

            return Promise.resolve({ user: user.toObject() })
        } catch (err) {
            return Promise.reject(err)
        }
    }
}