const Module = require('./module.model')
const { makeFakeModule } = require('../../../__test__/fixtures')
const {
	validateNotEmpty,
	validateStringEquality,
	validateBooleanEquality,
	validateNumberEquality,
	validateMongoDuplicationError,
	validateMongoValidationError,
} = require('../../utils/test-utils/validators.utils')
const {
	dbConnect,
	dbDisconnect,
} = require('../../utils/test-utils/dbHandler.utils')

beforeAll(async () => await dbConnect())
afterAll(async () => await dbDisconnect())

describe.skip('Module Model Test Suite', () => {
	it.skip('', async () => {})
})
