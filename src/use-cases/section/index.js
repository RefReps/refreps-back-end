const Section = require('../../database/models/section.model')

const makeAddSection = require('./addSection')
const makeCollapseSection = require('./collapseSections')
const makeDeleteSection = require('./deleteSection')
const makeFindAllSections = require('./findAllSections')
const makeFindSectionById = require('./findSectionById')
const makeMoveSectionOrder = require('./moveSectionOrder')
const makeUpdateSection = require('./updateSection')

const addSection = makeAddSection({ Section })
const collapseSection = makeCollapseSection({ Section })
const deleteSection = makeDeleteSection({ Section })
const findAllSections = makeFindAllSections({ Section })
const findSectionById = makeFindSectionById({ Section })
const moveSectionOrder = makeMoveSectionOrder({ Section })
const updateSection = makeUpdateSection({ Section })

module.exports = {
	addSection,
	collapseSection,
	deleteSection,
	findAllSections,
	findSectionById,
	moveSectionOrder,
	updateSection,
}
