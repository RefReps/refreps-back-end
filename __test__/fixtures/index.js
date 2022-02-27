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
		sections: [],
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
		modules: [],
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
		contents: [],
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

module.exports.makeFakeQuiz = (overrides) => {
	const quiz = {
		name: 'fake-quiz-name',
		quizVersions: [],
		activeVersion: 1,
	}
	return {
		...quiz,
		...overrides,
	}
}

module.exports.makeFakeQuestion = (overrides) => {
	const question = {
		questionType: '1_CHOICE',
		questionNumber: 1,
		question: 'What is my favorite number?',
		responses: {
			A: '1',
			B: '2',
			C: '3',
			D: '6',
		},
		answers: ['A', 'D'],
		points: 1,
	}
	return {
		...question,
		...overrides,
	}
}

module.exports.makeFakeQuizSubmission = (overrides) => {
	const values = {
		userId: '62126c51249f4356abc36608',
		quizId: '62126c51249f4356abc36610',
		quizVersionId: '62126c51249f4356abc36612',
		submitted: false,
		submissionNumber: 1,
		userAnswers: [],
		isGraded: false,
		grade: 0,
		dateStarted: Date.now(),
		dateFinished: undefined,
	}
	return {
		...values,
		...overrides,
	}
}

module.exports.makeFakeQuizVersion = (overrides) => {
	const quizVersion = {
		questions: [],
		versionNumber: 1,
		quizSubmissions: [],
	}
	return {
		...quizVersion,
		...overrides,
	}
}
