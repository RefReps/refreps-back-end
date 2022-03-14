/**
 * Builds a simple object given an error
 * @param {Error} error - any error object
 * @returns {success: false, error: {name, message}}
 */
module.exports.buildErrorResponse = (error) => {
	return { success: false, error: { name: error.name, message: error.message } }
}
