module.exports = makeMoveModuleOrder = ({ Module }) => {
	// Move a moduleOrder and fix the order of other ordering
	// Resolve -> {count: #, module: {moduleObject}}
	// Rejects -> error
	// param: id -> string of module id
	// param: newOrder -> int of new module (min: 1)
	return async function moveModuleOrder(id, newOrder) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					throw new ReferenceError('`id` is required')
				}
				if (!newOrder) {
					throw new ReferenceError('`newOrder` is required')
				}

				const module = await Module.findById(id).exec()

				if (module == null) {
					return resolve({ changed: 0 })
				}

				let changed = 0
				const oldOrder = module.moduleOrder
				if (newOrder > oldOrder) {
					const docs = await Module.where('courseId')
						.equals(module['courseId'])
						.where('moduleOrder')
						.gte(oldOrder)
						.lte(newOrder)
						.updateMany({ $inc: { moduleOrder: -1 } })
						.exec()
					changed = docs.modifiedCount
				} else if (newOrder < oldOrder) {
					const docs = await Module.where('courseId')
						.equals(module['courseId'])
						.where('moduleOrder')
						.gte(newOrder)
						.lte(oldOrder)
						.updateMany({ $inc: { moduleOrder: 1 } })
						.exec()
					changed = docs.modifiedCount
				} else {
					// newOrder == oldOrder
					changed = 0
				}

				// update the desired moduleOrder
				await Module.findByIdAndUpdate(id, {
					moduleOrder: newOrder,
				})

				return resolve({ changed: changed })
			} catch (error) {
				return reject(error)
			}
		})
	}
}
