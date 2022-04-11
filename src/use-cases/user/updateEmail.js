//update email for a user
module.exports = makeUpdateEmail = ({ User }) => {
    // Updates a user's email
    // Resolve -> user document
    // Reject -> error
    return async function updateEmail(id, email) {
        try {
            // Update the user's email
            const options = { returnDocument: 'after' }
            const user = await User.findByIdAndUpdate(
                id,
                { email: email },
                options
            )
                
            return Promise.resolve({ user: user.toObject() })
        } catch (err) {
            return Promise.reject(err)
        }
    }
}