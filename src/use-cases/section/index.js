const Section = require('../../database/models/section.model')
const Course = require('../../database/models/course.model')
const Module = require('../../database/models/module.model')
const Content = require('../../database/models/content.model')

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
const copySection = makeCopySection({ Section, Course })
const deleteSection = makeDeleteSection({ Section, Course, Module, Content })
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
