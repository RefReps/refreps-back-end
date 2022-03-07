# Quiz Routes

## Remember to be authenticated!

---

### [POST] ~/api/auth/register

#### Description

- Register an account in the database

#### Params

```json
FORM
email: String
password: String
```

#### Returns

```json
{
    "success": boolean,
    "access_token": string,
    "refresh_token": string
}
```

#### Usage

- Use a FORM to send input
- Use the `access_token` in the `Bearer` authentication token to authenticate the associated `email`

#### Example

```json
input:
email: "bubbly@email.com"
password: "111111"

response:
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJ1YmJseUBlbWFpbC5jb20iLCJpYXQiOjE2NDYwMTY4MTUsImV4cCI6MTY0NjE5NjgxNX0.F1tEy70wwCEi-5BYgq1GM2oy8yVXM3MSEJV7AYReytI",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJ1YmJseUBlbWFpbC5jb20iLCJpYXQiOjE2NDYwMTY4MTUsImV4cCI6MTY0NjEwMzIxNX0.WwlqWGLhefus_kBoTwgRh9hI5T-NEgLLnVpy6zUpKro"
}

```

---

### [POST] ~/api/auth/login

#### Description

- Login to an account in the database

#### Params

```json
FORM
email: String
password: String
```

#### Returns

```json
{
    "success": boolean,
    "access_token": string,
    "refresh_token": string,
    "user_role": ["user"|"admin"]
}
```

#### Usage

- Use a FORM to send input
- Use the `access_token` in the `Bearer` authentication token to authenticate the associated `email`

#### Example

```json
input:
email: "bubbly@email.com"
password: "111111"

response:
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJ1YmJseUBlbWFpbC5jb20iLCJpYXQiOjE2NDYwMTY4MTUsImV4cCI6MTY0NjE5NjgxNX0.F1tEy70wwCEi-5BYgq1GM2oy8yVXM3MSEJV7AYReytI",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJ1YmJseUBlbWFpbC5jb20iLCJpYXQiOjE2NDYwMTY4MTUsImV4cCI6MTY0NjEwMzIxNX0.WwlqWGLhefus_kBoTwgRh9hI5T-NEgLLnVpy6zUpKro",
  "user_role": "user"
}
```

---

## Quiz Routes

---

### [POST] ~/api/quiz

#### Description

- Create a new quiz and get the quizId as a response

#### Params

```json
FORM
name: string (required)
```

#### Returns

```json
{
  "_id": string
}
```

#### Usage

-

#### Example

```json
Input:
name: "Cool Quiz"

Response:
{
  "_id": "621c4c34d9583ec58df951d4"
}
```

---

### [GET] ~/api/quiz/:quizId

#### Description

- Get a quiz based on the quizId

#### Params

```json
Query Param: quizId
```

#### Returns

```json
{
    quiz: object (look at database/models/quiz.model),
    quizVersions: object (look at database/models/quizVersion.model)
}
```

#### Usage

-

#### Example

```json
Input:
None

Response:
{
  "quiz": {
    "_id": "621c4c34d9583ec58df951d4",
    "name": "Cool Quiz",
    "quizVersions": [
      {
        "_id": "621c4c34d9583ec58df951d5",
        "questions": [],
        "versionNumber": 1,
        "quizSubmissions": [],
        "createdAt": "2022-02-28T04:14:44.335Z",
        "updatedAt": "2022-02-28T04:14:44.335Z",
        "__v": 0
      }
    ],
    "activeVersion": 1,
    "createdAt": "2022-02-28T04:14:44.337Z",
    "updatedAt": "2022-02-28T04:14:44.337Z",
    "__v": 0
  },
  "quizVersion": {
    "_id": "621c4c34d9583ec58df951d5",
    "questions": [],
    "versionNumber": 1,
    "quizSubmissions": [],
    "createdAt": "2022-02-28T04:14:44.335Z",
    "updatedAt": "2022-02-28T04:14:44.335Z",
    "__v": 0
  }
}
```

---

### [PUT] ~/api/quiz/:quizId/batch

#### Description

- Add/Delete questions to the quiz based on the `quizId`
- Questions are then collapsed if needed

#### Params

```json
{
    "questions": [],
    "deleteQuestion": [Number,...]
}
```

#### Returns

```json
{
    quiz: object (look at database/models/quiz.model),
    quizVersions: object (look at database/models/quizVersion.model)
}
```

#### Usage

- Questions are first deleted from the `deleteQuestions`
- Questions are then added from the `questions`
- Questions are finally collapsed (if needed)

#### Example

```json
Input:
{
    "questions": [{
        "questionNumber": 1,
        "question": "Favorite color",
        "responses": {
            "A": "red",
            "B": "green"
        },
        "answers": ["A"],
        "questionType": "1_CHOICE",
        "points": 1
    }],
    "deleteQuestions": [1]
}

Output:
{
  "quiz": {
    "_id": "621c4c34d9583ec58df951d4",
    "name": "Cool Quiz",
    "quizVersions": [
      "621c4c34d9583ec58df951d5",
      "621c4eaad9583ec58df951e8"
    ],
    "activeVersion": 2,
    "createdAt": "2022-02-28T04:14:44.337Z",
    "updatedAt": "2022-02-28T04:25:14.245Z",
    "__v": 1
  },
  "quizVersion": {
    "questions": [
      {
        "questionNumber": 1,
        "question": "Favorite color",
        "responses": {},
        "answers": [
          "A"
        ],
        "questionType": "1_CHOICE",
        "points": 1,
        "_id": "621c4eaad9583ec58df951ea"
      }
    ],
    "versionNumber": 2,
    "quizSubmissions": [],
    "_id": "621c4eaad9583ec58df951e8",
    "createdAt": "2022-02-28T04:25:14.242Z",
    "updatedAt": "2022-02-28T04:25:14.242Z",
    "__v": 0
  }
}
```

---

### [GET] ~/api/quiz/:quizId/start

#### Description

- Starts a quiz for the user (Resumes as well)

#### Params

```json
NONE
```

#### Returns

```json
{
    quizQuestions: [{questionNumber, question, responses: {A: '', B: '', ...}}, ...],
    quizSubmission: object (mongoose model, look at database/models/quizSubmission.model)
}
```

#### Usage

-

#### Example

```json
Input:
NONE

Output:
{
  "questions": [
    {
      "questionNumber": 1,
      "question": "Favorite color",
      "responses": {
        "A": "red",
        "B": "green"
      },
      "questionType": "1_CHOICE",
      "points": 1
    },
    {
      "questionNumber": 2,
      "question": "Favorite color (2)",
      "responses": {
        "A": "red",
        "B": "green",
        "C": "orange"
      },
      "questionType": "1_CHOICE",
      "points": 1
    }
  ],
  "quizSubmission": {
    "userId": "621c5085d9583ec58df951ef",
    "quizId": "621c4c34d9583ec58df951d4",
    "quizVersionId": "621c4eaad9583ec58df951e8",
    "submitted": false,
    "submissionNumber": 1,
    "userAnswers": [],
    "answerOverrides": [],
    "isGraded": false,
    "grade": 0,
    "dateStarted": "2022-02-28T04:33:32.594Z",
    "dateFinished": null,
    "_id": "621c509cd9583ec58df951fa",
    "createdAt": "2022-02-28T04:33:32.596Z",
    "updatedAt": "2022-02-28T04:33:32.596Z",
    "__v": 0
  }
}
```

---

### [GET] ~/api/quiz/:quizId/resume

#### Description

- Experimental (Look at ~/api/quiz/resume)

#### Params

```json

```

#### Returns

```json

```

#### Usage

-

#### Example

```json

```

---

### [PUT] ~/api/quiz/:quizId/submission/:submissionId

#### Description

- Save incoming answers to the user's submission

#### Params

```json
{
    "questions": [{questionNumber: Number, answers:[]}, ...]
}
```

#### Returns

```json
{}
```

#### Usage

- Use when saving a user's answers to a submission
- Overriding is fine to do

#### Example

```json
Input:
{
    "questions": [
        {
            "questionNumber": 1,
            "answers": ["A"]
        },
        {
            "questionNumber": 2,
            "answers": ["B"]
        }
    ]
}

Output:
{
  "_id": "621c509cd9583ec58df951fa",
  "userId": "621c5085d9583ec58df951ef",
  "quizId": "621c4c34d9583ec58df951d4",
  "quizVersionId": "621c4eaad9583ec58df951e8",
  "submitted": false,
  "submissionNumber": 1,
  "userAnswers": [
    {
      "questionNumber": 1,
      "answers": [
        "A"
      ],
      "_id": "621c5311d9583ec58df95204"
    },
    {
      "questionNumber": 2,
      "answers": [
        "B"
      ],
      "_id": "621c5311d9583ec58df95205"
    }
  ],
  "answerOverrides": [],
  "isGraded": false,
  "grade": 0,
  "dateStarted": "2022-02-28T04:33:32.594Z",
  "dateFinished": null,
  "createdAt": "2022-02-28T04:33:32.596Z",
  "updatedAt": "2022-02-28T04:44:01.149Z",
  "__v": 1
}
```

---

### [GET] ~/api/quiz/:quizId/grade

#### Description

- Get all the grades for the user (only works on the current authenticated user)

#### Params

```json
NONE
```

#### Returns

```json
{
    "submissions": [object] (look at database/models/quizSubmission)
}
```

#### Usage

-

#### Example

```json
Input:
NONE

Output:
{
  "submissions": [
    {
      "userId": "621c5085d9583ec58df951ef",
      "submissionId": "621c509cd9583ec58df951fa",
      "quizId": "621c4c34d9583ec58df951d4",
      "submissionNumber": 1,
      "grade": 1,
      "userAnswers": [
        {
          "questionNumber": 1,
          "answers": [
            "A"
          ],
          "_id": "621c5311d9583ec58df95204"
        },
        {
          "questionNumber": 2,
          "answers": [
            "B"
          ],
          "_id": "621c5311d9583ec58df95205"
        }
      ],
      "quizQuestions": [
        {
          "questionNumber": 1,
          "question": "Favorite color (4)",
          "responses": {
            "A": "red",
            "B": "green"
          },
          "answers": [
            "A"
          ],
          "questionType": "1_CHOICE",
          "points": 1,
          "_id": "621c4eaad9583ec58df951ea"
        }
      ],
      "quizVersionNumber": 2,
      "dateStarted": "2022-02-28T04:33:32.594Z",
      "dateFinished": "2022-02-28T04:53:47.135Z"
    }
  ]
}
```

---

### [POST] ~/api/quiz/:quizId/grade/:submissionId

#### Description

- Finishes and grades a submission

#### Params

```json
NONE
```

#### Returns

```json
{
    "submission": object (look at database/models/quizSubmission)
}
```

#### Usage

-

#### Example

```json
Input:
NONE

Output:
{
  "submission": {
    "_id": "621c509cd9583ec58df951fa",
    "userId": "621c5085d9583ec58df951ef",
    "quizId": "621c4c34d9583ec58df951d4",
    "quizVersionId": {
      "_id": "621c4eaad9583ec58df951e8",
      "questions": [
        {
          "questionNumber": 1,
          "question": "Favorite color (4)",
          "responses": {},
          "answers": [
            "A"
          ],
          "questionType": "1_CHOICE",
          "points": 1,
          "_id": "621c4eaad9583ec58df951ea"
        }
      ],
      "versionNumber": 2,
      "quizSubmissions": [
        "621c509cd9583ec58df951fa"
      ],
      "createdAt": "2022-02-28T04:25:14.242Z",
      "updatedAt": "2022-02-28T04:33:32.598Z",
      "__v": 1
    },
    "submitted": true,
    "submissionNumber": 1,
    "userAnswers": [
      {
        "questionNumber": 1,
        "answers": [
          "A"
        ],
        "_id": "621c5311d9583ec58df95204"
      },
      {
        "questionNumber": 2,
        "answers": [
          "B"
        ],
        "_id": "621c5311d9583ec58df95205"
      }
    ],
    "answerOverrides": [
      {
        "questionNumber": 1,
        "isCorrect": true,
        "isPointDifferent": false,
        "pointAward": 1,
        "_id": "621c555bd9583ec58df9520d"
      }
    ],
    "isGraded": true,
    "grade": 1,
    "dateStarted": "2022-02-28T04:33:32.594Z",
    "dateFinished": "2022-02-28T04:53:47.135Z",
    "createdAt": "2022-02-28T04:33:32.596Z",
    "updatedAt": "2022-02-28T04:53:47.136Z",
    "__v": 2
  }
}
```

---

### [GET] ~/api/quiz/:quizId/view-grades

#### Description

- Get all the submission grades from a specified quiz

#### Params

```json
NONE
```

#### Returns

```json
{
    submissions: [{submissionId, userId, email, grade, submissionNumber, dateStarted, dateFinished}, ...]
}
```

#### Usage

-

#### Example

```json
Input:
NONE

Output:
{
  "submissions": [
    {
      "submissionId": "621c509cd9583ec58df951fa",
      "userId": "621c5085d9583ec58df951ef",
      "email": "hunter@email.com",
      "grade": 1,
      "submissionNumber": 1,
      "dateStarted": "2022-02-28T04:33:32.594Z",
      "dateFinished": "2022-02-28T04:53:47.135Z"
    },
        {
      "submissionId": "621c509cd9583ec58df95123",
      "userId": "621c5085d9583ec58df95123",
      "email": "example@email.com",
      "grade": 0.75,
      "submissionNumber": 1,
      "dateStarted": "2022-02-28T04:33:32.594Z",
      "dateFinished": "2022-02-28T04:53:47.135Z"
    }
  ]
}
```
