const Section = require('../../database/models/section.model')
const Course = require('../../database/models/course.model')

const makeAddSection = require('./addSection')
const makeCollapseSection = require('./collapseSections')
const makeCopySection = require('./copySection')
const makeDeleteSection = require('./deleteSection')
const makeFindAllSections = require('./findAllSections')
const makeFindSectionById = require('./findSectionById')
const makeMoveSectionOrder = require('./moveSectionOrder')
const makeUpdateSection = require('./updateSection')

const addSection = makeAddSection({ Section, Course })
const collapseSection = makeCollapseSection({ Section })
const copySection = makeCopySection({ Section })
const deleteSection = makeDeleteSection({ Section, Course })
const findAllSections = makeFindAllSections({ Section })
const findSectionById = makeFindSectionById({ Section })
const moveSectionOrder = makeMoveSectionOrder({ Section })
const updateSection = makeUpdateSection({ Section })

module.exports = {
	addSection,
	collapseSection,
	copySection,
	deleteSection,
	findAllSections,
	findSectionById,
	moveSectionOrder,
	updateSection,
}
