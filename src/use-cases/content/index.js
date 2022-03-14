const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')

const makeAddContent = require('./addContent')
const makeCollapseContent = require('./collapseContents')
const makeCopyContent = require('./copyContent')
const makeDeleteContent = require('./deleteContent')
const makeFindAllContents = require('./findAllContents')
const makeFindContentById = require('./findContentById')
const makeMoveContentOrder = require('./moveContentOrder')
const makeUpdateContent = require('./updateContent')

const addContent = makeAddContent({ Content, Module })
const collapseContent = makeCollapseContent({ Content })
const copyContent = makeCopyContent({ Content })
const deleteContent = makeDeleteContent({ Content, Module })
const findAllContents = makeFindAllContents({ Content })
const findContentById = makeFindContentById({ Content })
const moveContentOrder = makeMoveContentOrder({ Content })
const updateContent = makeUpdateContent({ Content })

module.exports = {
	addContent,
	collapseContent,
	copyContent,
	deleteContent,
	findAllContents,
	findContentById,
	moveContentOrder,
	updateContent,
}
