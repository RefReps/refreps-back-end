require('dotenv').config({ path: '.env' })

const fs = require('fs')
const dir = process.env.LOCAL_UPLOAD_PATH

const checkIfLocalUploadDir = () => {
	if (fs.existsSync(dir)) {
		return true
	}
	return false
}

const createLocalUploadDir = () => {
	console.log(`Making local upload dir at ${dir}`)
	fs.mkdirSync(dir, { recursive: true })
}

module.exports = {
	checkIfLocalUploadDir,
	createLocalUploadDir,
}
