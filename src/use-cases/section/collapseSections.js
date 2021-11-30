module.exports = makeCollapseSections = ({ Section }) => {
	// Collapses all sections sectionOrder(s) in the db
	// Resolve -> {found: #, sections: [section objects]}
	// Reject -> error
	return async function collapseSections(courseId) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!courseId) {
					throw new ReferenceError('courseId is undefined')
				}

				let query = {}
				query['courseId'] = courseId

				const sectionQuery = Section.find(query)

				sectionQuery.sort({ sectionOrder: 1, _id: 1 })
				const sectionDocs = await sectionQuery.exec()

				// Move all sections down a number until the first section has sectionOrder=1
				while (sectionDocs[0].sectionOrder > 1) {
					sectionDocs.forEach((doc) => {
						doc.sectionOrder -= 1
					})
				}

				const totalDocs = sectionDocs.length
				if (totalDocs > 1) {
					// Find any gaps in the section and decrease those sectionOrder(s) by 1
					// (Loop through 2nd to last)
					for (let i = 1; i < totalDocs; i++) {
						const previous = i - 1
						while (
							sectionDocs[i].sectionOrder !=
							sectionDocs[previous].sectionOrder + 1
						) {
							sectionDocs[i].sectionOrder -= 1
						}
					}

					// Find duplicate sectionOrder(s) and fix by adding 1
					// (Loop through first to second last)
					for (let i = 0; i < totalDocs - 1; i++) {
						if (
							sectionDocs[i].sectionOrder == sectionDocs[i + 1].sectionOrder
						) {
							sectionDocs[i + 1].sectionOder += 1
						}
					}

					// Check to see if the last sectionOrder is equal to the prior and fix if needed
					if (
						sectionDocs[totalDocs - 2].sectionOrder ==
						sectionDocs[totalDocs - 1].sectionOrder
					) {
						sectionDocs[totalDocs - 1].sectionOrder += 1
					}
				}

				// Save all docs
				for (let i = 0; i < totalDocs; i++) {
					await Section.findByIdAndUpdate(sectionDocs[i]._id, {
						sectionOrder: sectionDocs[i].sectionOrder,
					}).exec()
				}

				let sectionObjects = []
				sectionDocs.forEach((doc) => {
					sectionObjects.push(doc.toObject())
				})
				return resolve({
					found: sectionObjects.length,
					sections: sectionObjects,
				})
			} catch (err) {
				return reject(err)
			}
		})
	}
}
