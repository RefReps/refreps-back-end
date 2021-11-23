module.exports.validateNotEmpty = (received) => {
	expect(received).not.toBeNull()
	expect(received).not.toBeUndefined()
	expect(received).toBeTruthy()
}

module.exports.validateStringEquality = (received, expected) => {
	expect(received).toBeDefined()
	expect(received).not.toEqual('should not equal this')
	expect(received).toEqual(expected)
}

module.exports.validateBooleanEquality = (received, expected) => {
	expect(received).toBeDefined()
	expect(received).toBe(expected)
}

module.exports.validateNumberEquality = (received, expected) => {
	expect(received).toBeDefined()
	expect(received).toBe(expected)
}

module.exports.validateMongoDuplicationError = (name, code) => {
	expect(name).toEqual('MongoError')
	expect(code).not.toBe(255)
	expect(code).toBe(11000)
}

module.exports.validateMongoValidationError = (name) => {
	expect(name).toEqual('ValidationError')
}
