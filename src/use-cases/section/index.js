const Section = require('../../database/models/section.model')

const makeAddSection = require('./addSection')
const makeDeleteSection = require('./deleteSection')
const makeFindAllSections = require('./findAllSections')
const makeUpdateSection = require('./updateSection')

const addSection = makeAddSection({ Section })
const deleteSection = makeDeleteSection({ Section })
const findAllSections = makeFindAllSections({ Section })
const updateSection = makeUpdateSection({ Section })

module.exports = {
	addSection,
	deleteSection,
	findAllSections,
	updateSection,
}
