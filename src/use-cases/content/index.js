const Content = require('../../database/models/content.model')
const Module = require('../../database/models/module.model')
const User = require('../../database/models/user.model')
const Course = require('../../database/models/course.model')

const makeAddContent = require('./addContent')
const makeCollapseContent = require('./collapseContents')
const makeCopyContent = require('./copyContent')
const makeDeleteContent = require('./deleteContent')
const makeFindAllContents = require('./findAllContents')
const makeFindContentById = require('./findContentById')
const makeIsAuthorOnContent = require('./isAuthorOnContent')
const makeMarkCompleteForStudent = require('./markCompleteForStudent')
const makeMoveContentOrder = require('./moveContentOrder')
const makestudentsProgress = require('./studentsProgress')
const makeUpdateContent = require('./updateContent')

const addContent = makeAddContent({ Content, Module })
const collapseContent = makeCollapseContent({ Content })
const copyContent = makeCopyContent({ Content, Module })
const deleteContent = makeDeleteContent({ Content, Module })
const findAllContents = makeFindAllContents({ Content })
const findContentById = makeFindContentById({ Content })
const isAuthorOnContent = makeIsAuthorOnContent({ Content, User })
const markCompleteForStudent = makeMarkCompleteForStudent({ Content, User })
const moveContentOrder = makeMoveContentOrder({ Content })
const studentsProgress = makestudentsProgress({ Content, Course })
const updateContent = makeUpdateContent({ Content })

module.exports = {
	addContent,
	collapseContent,
	copyContent,
	deleteContent,
	findAllContents,
	findContentById,
	isAuthorOnContent,
	markCompleteForStudent,
	moveContentOrder,
	studentsProgress,
	updateContent,
}
