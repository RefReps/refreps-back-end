const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
const uuid = require('uuid')
const path = require('path')

const s3 = new aws.S3({ apiVersion: '2006-03-01' })
// Needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

const upload = multer({
	stoarge: multerS3({
		s3: s3,
		bucket: 'test',
		metadata: (req, file, cb) => {
			cb(null, { fieldName: file.fieldname })
		},
		key: (req, file, cb) => {
			const ext = path.extname(file.originalname)
			cb(null, `${uuid()}${ext}`)
		},
	}),
})

module.exports = upload.array('video')
