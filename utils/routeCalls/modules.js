const conn = require('../mongodb/dbConnection')
const moduleCollection = require('../mongodb/moduleCollection')
require('dotenv').config({ path: '.env' })

const db_uri = process.env.DB_CONNECT

// Responds all modules in the db if successful
// Responds 400 error on failure
module.exports.getAccessibleModules = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let doc = await moduleCollection.getAllModules()
		conn.close()
		res.status(200).json(doc)
	} catch (err) {
		res.status(400).json(err)
	} finally {
		next()
	}
}

// Updates (Not upsert) new module in the db
// Responds the updated module on success
// Responds 400 error on failure
// IMPORTANT: Must include a req.body (usually obtained from `multer`)
module.exports.saveNewModule = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let doc = await moduleCollection.createNewModule(req.body)
		conn.close()
		res.status(201).json(doc)
	} catch (err) {
		res.status(400).json(err)
	} finally {
		next()
	}
}

// Responds a single module back to the user on success
// Responds 400 error on failure
module.exports.getOneModule = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let doc = await moduleCollection.getModuleById(req.params.moduleId)
		conn.close()
		res.status(200).json(doc)
	} catch (err) {
		res.status(404).json(err)
	} finally {
		next()
	}
}

// Responds the updated module on success
// Responds 404 error on failure
// Important: Takes a req.body (Usually from `multer`)
module.exports.updateOneModule = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let doc = await moduleCollection.updateModuleById(
			req.params.moduleId,
			req.body
		)
		conn.close()
		res.status(200).json(doc)
	} catch (err) {
		res.status(404).json(err)
	} finally {
		next()
	}
}

// Responds the deleted module on success
// Responds 404 error on failure
module.exports.deleteOneModule = async (req, res, next) => {
	try {
		await conn.openUri(db_uri)
		let doc = await moduleCollection.deleteModuleById(req.params.moduleId)
		conn.close()
		res.status(200).json(doc)
	} catch (err) {
		res.status(404).json(err)
	} finally {
		next()
	}
}
