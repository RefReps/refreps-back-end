const router = require('express').Router()
require('dotenv').config({ path: '.env' })
const multer = require('multer')()

const useCases = require('../use-cases/index')

router
	.route('/')
	// findAllModules
	.get(async (req, res) => {
		try {
			const { sectionId } = req.query
			if (!sectionId) {
				throw new ReferenceError('query for sectionId must be provided')
			}
			const result = await useCases.Module_.findAllModules(sectionId)
			res.send(result.modules)
		} catch (error) {
			res.status(400).send(error.message)
		}
	})
	// addModule
	.post(multer.none(), async (req, res) => {
		try {
			const result = await useCases.Module_.addModule(req.body)
			await useCases.Module_.collapseModule(req.body.sectionId)
			res.status(204).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})

router
	.route('/:moduleId')
	// findModuleById
	.get(async (req, res) => {
		try {
			const { moduleId } = req.params
			const result = await useCases.Module_.findModuleById(moduleId)
			res.send(result)
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// deleteModule
	.delete(async (req, res) => {
		const { moduleId } = req.params
		try {
			const module = await useCases.Module_.findModuleById(moduleId)
			await useCases.Module_.deleteModule(moduleId)
			await useCases.Module_.collapseModule(module.sectionId)
			res.status(204).send()
		} catch (error) {
			res.status(400).send(error)
		}
	})
	// updateModule
	.put(multer.none(), async (req, res) => {
		const { moduleId } = req.params
		const { name, sectionId, isPublished, moduleOrder, dropDate } = req.body
		try {
			// Update order if req.body.moduleOrder
			if (moduleOrder) {
				await useCases.Module_.moveModuleOrder(moduleId, moduleOrder)
				const module = await useCases.Module_.findModuleById(moduleId)
				await useCases.Module_.collapseModule(module.sectionId)
			}

			const moduleInfo = {}
			moduleInfo['name'] = name ? name : undefined
			const result = await useCases.Module_.updateModule(moduleId, moduleInfo)
			res.send(result)
		} catch (error) {
			res.status(400).send(error.toString())
		}
	})

module.exports = router
