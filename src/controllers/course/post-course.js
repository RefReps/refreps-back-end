module.exports = makePostCourse = ({ addCourse }) => {
	return async function postCourse(httpRequest) {
		try {
			const { ...courseInfo } = httpRequest.body
			const posted = await addCourse({ ...courseInfo })
			return {
				headers: {
					'Content-Type': 'application/json',
					'Last-Modified': new Date(posted.modifiedOn).toUTCString(),
				},
				statusCode: 201,
				body: { posted },
			}
		} catch (error) {
			// TODO: Error logging

			return {
				headers: {
					'Content-Type': 'application/json',
				},
				statusCode: 400,
				body: {
					error: error.message,
				},
			}
		}
	}
}
