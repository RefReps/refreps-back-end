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
		contentOrder: 1,
		toDocument: '619c14ba91b3af1d40e29555',
		onModel: 'Video',
	}
	return {
		...content,
		...overrides,
	}
}

module.exports.makeFakeVideo = (overrides) => {
	const video = {
		fieldname: 'video',
		originalname: 'video123.mp4',
		encoding: '7bit',
		mimetype: 'video123/mp4',
		destination: 'uploads/',
		filename: 'video123.mp4',
		path: 'uploads\\video123.mp4',
		size: 8443873,
	}
	return {
		...video,
		...overrides,
	}
}
