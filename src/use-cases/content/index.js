const Content = require('../../database/models/content.model')

const makeAddContent = require('./addContent')
const makeCollapseContent = require('./collapseContents')
const makeDeleteContent = require('./deleteContent')
const makeFindAllContents = require('./findAllContents')
const makeFindContentById = require('./findContentById')
const makeMoveContentOrder = require('./moveContentOrder')
const makeUpdateContent = require('./updateContent')

const addContent = makeAddContent({ Content })
const collapseContent = makeCollapseContent({ Content })
const deleteContent = makeDeleteContent({ Content })
const findAllContents = makeFindAllContents({ Content })
const findContentById = makeFindContentById({ Content })
const moveContentOrder = makeMoveContentOrder({ Content })
const updateContent = makeUpdateContent({ Content })

module.exports = {
	addContent,
	collapseContent,
	deleteContent,
	findAllContents,
	findContentById,
	moveContentOrder,
	updateContent,
}
