module.exports = makeMoveSectionOrder = ({ Section }) => {
	// Move a sectionOrder and fix the order of other ordering
	// Resolve -> {count: #, section: {sectionObject}}
	// Rejects -> error
	// param: id -> string of section id
	// param: newOrder -> int of new section (min: 1)
	return async function moveSectionOrder(id, newOrder) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					throw new ReferenceError('`id` is required')
				}
				if (!newOrder) {
					throw new ReferenceError('`newOrder` is required')
				}

				const section = await Section.findById(id).exec()

				if (section == null) {
					return resolve({ changed: 0 })
				}

				let changedSections = 0
				const oldOrder = section.sectionOrder
				if (newOrder > oldOrder) {
					const docs = await Section.where('courseId')
						.equals(section['courseId'])
						.where('sectionOrder')
						.gte(oldOrder)
						.lte(newOrder)
						.updateMany({ $inc: { sectionOrder: -1 } })
						.exec()
					changedSections = docs.modifiedCount
				} else if (newOrder < oldOrder) {
					const docs = await Section.where('courseId')
						.equals(section['courseId'])
						.where('sectionOrder')
						.gte(newOrder)
						.lte(oldOrder)
						.updateMany({ $inc: { sectionOrder: 1 } })
						.exec()
					changedSections = docs.modifiedCount
				} else {
					// newOrder == oldOrder
					changedSections = 0
				}

				// update the desired sectionOrder
				await Section.findByIdAndUpdate(id, {
					sectionOrder: newOrder,
				})

				return resolve({ changed: changedSections })
			} catch (error) {
				return reject(error)
			}
		})
	}
}
