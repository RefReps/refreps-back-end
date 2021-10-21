const multer = require('multer')
const uuid = require('uuid').v4
require('dotenv').config({ path: '.env' })

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, process.env.LOCAL_UPLOAD_PATH)
	},
	filename: (req, file, cb) => {
		const { originalname } = file
		cb(null, `${uuid()}-${originalname}`)
	},
})

module.exports = multer({ storage: storage }).array('video')
