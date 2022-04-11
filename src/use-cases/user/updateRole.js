//update updateRole for a user
module.exports = makeUpdateRole = ({ User }) => {
    // Updates a user's role
    // Resolve -> user document
    // Reject -> error
    return async function updateRole(id, role) {
        try {
            // Update the user's role
            const options = { returnDocument: 'after' }
            const user = await User.findByIdAndUpdate(
                id,
                { role: role },
                options
            )
            return Promise.resolve({ user: user.toObject() })
        } catch (err) {
            return Promise.reject(err)
        }
    }
}