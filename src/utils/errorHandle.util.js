module.exports = function (error) {
	console.log(error.stack)
	switch (error.name) {
		case 'CastError':
			return 'Error - Type: CastError'
		case 'TypeError':
			return 'Error - Type: TypeError'

		default:
			return `Error not properly handled. Type: ${error.name}`
	}
}
