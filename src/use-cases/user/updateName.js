//update user first and last name
module.exports = makeUpdateName = ({ User }) => {
    // Updates a user's first and last name
    // Resolve -> user document
    // Reject -> error
    return async function updateName(id, firstName, lastName) {
        try {
            // Update the user's first and last name
            const options = { returnDocument: 'after' }
            const user = await User.findByIdAndUpdate(
                id,
                { firstName: firstName, lastName: lastName },
                options
            )
            return Promise.resolve({ user: user.toObject() })
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

