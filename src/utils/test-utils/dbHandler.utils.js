const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

module.exports.dbConnect = async () => {
	mongoServer = mongoServer || (await MongoMemoryServer.create())
	const uri = mongoServer.getUri()

	const mongooseOpts = {
		useNewUrlParser: true,
	}

	await mongoose.connect(uri, mongooseOpts)
}

module.exports.dbDisconnect = async () => {
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
	await mongoServer.stop()
}
