require('dotenv').config({ path: '.env' })

module.exports.checkAllCriticalEnvVariablesExists = () => {
	const checking = [
		'HOST',
		'PORT',
		'DB_CONNECT',
		'DB_TEST',
		'TOKEN_SECRET',
		'LOCAL_UPLOAD_PATH',
	]
	let envObj = {}
	checking.forEach((ele) => {
		envObj[ele] = process.env[ele]
	})
	let errorList = []
	Object.entries(envObj).forEach(([key, val]) => {
		if (val === '' || val === undefined) {
			errorList.push(`Could not find ${key} in env file`)
		}
	})
	if (errorList.length > 0) {
		console.error(errorList.toString())
		return false
	}
	return true
}
