module.exports.makeFakeCourse = (overrides) => {
	const course = {
		name: 'Test Name',
		isTemplate: true,
		isPublished: true,
		isDeleted: false,
		settings: {
			isEnforcements: true,
			enforcementPercent: 50,
			isGradedQuizAdvance: true,
			maximumQuizAttempts: 4,
		},
	}
	return {
		...course,
		...overrides,
	}
}

module.exports.makeFakeSection = (overrides) => {
	const section = {
		name: 'Section Name',
		courseId: '619c14ba91b3af1d40e295e5',
		isPublished: true,
		sectionOrder: 1,
		dropDate: null,
	}
	return {
		...section,
		...overrides,
	}
}

module.exports.makeFakeModule = (overrides) => {
	const module = {
		name: 'Module Name',
		sectionId: '619c14ba91b3af1d40e295f1',
		isPublished: true,
		moduleOrder: 1,
		dropDate: null,
	}
	return {
		...module,
		...overrides,
	}
}

module.exports.makeFakeContent = (overrides) => {
	const content = {
		name: 'Content Name',
		moduleId: '619c14ba91b3af1d40e29522',
		isPublished: true,
		contentOrder: 0,
		toContentId: '619c14ba91b3af1d40e29555',
		onModel: 'Video',
	}
	return {
		...content,
		...overrides,
	}
}
