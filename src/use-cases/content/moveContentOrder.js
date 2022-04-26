module.exports = makeMoveContentOrder = ({ Content }) => {
	// Move a contentOrder and fix the order of other ordering
	// Resolve -> {count: #, content: {contentObject}}
	// Rejects -> error
	// param: id -> string of content id
	// param: newOrder -> int of new content (min: 1)
	return async function moveContentOrder(id, newOrder) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					throw new ReferenceError('`id` is required')
				}
				if (!newOrder) {
					throw new ReferenceError('`newOrder` is required')
				}

				const content = await Content.findById(id).exec()

				if (content == null) {
					return resolve({ changed: 0 })
				}

				let changedContents = 0
				const oldOrder = content.contentOrder
				if (newOrder > oldOrder) {
					const docs = await Content.where('moduleId')
						.equals(content['moduleId'])
						.where('contentOrder')
						.gte(oldOrder)
						.lte(newOrder)
						.updateMany({ $inc: { contentOrder: -1 } })
						.exec()
					changedContents = docs.modifiedCount
				} else if (newOrder < oldOrder) {
					const docs = await Content.where('moduleId')
						.equals(content['moduleId'])
						.where('contentOrder')
						.gte(newOrder)
						.lte(oldOrder)
						.updateMany({ $inc: { contentOrder: 1 } })
						.exec()
					changedContents = docs.modifiedCount
				} else {
					// newOrder == oldOrder
					changedContents = 0
				}

				// update the desired contentOrder
				await Content.findByIdAndUpdate(id, {
					contentOrder: newOrder,
				})

				return resolve({ changed: changedContents })
			} catch (error) {
				return reject(error)
			}
		})
	}
}
