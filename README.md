# RefReps API BallState

## API Manual Setup of Repository

- Download the repository on your local machine: `https://github.com/hunterdurbin/refreps-back-end`
- Navigate to the root of the repository
- If you don't already have `nodemon` installed globally, run `npm install -g nodemon`
  - If you choose to just run the codebase without nodemon, you may skip this step
- Run `npm install` at root of the repository
- Create a `.env` file at the root of the repo
- Copy the template content of `sample.env` file (located at the root of the repository) into your `.env` file
- Fill out the information in the `.env` file
  - When filling out the `.env`, remember:
  - Remove any square brackets
  - Put double quotes around values
- Run `npm run devStart` at the root of the repository to run the API server
  - Alternatively, run `npm run start` to execute the application without `nodemon`
  - Note that the application will refuse to execute if the `.env`
    file variables are not populated
- Additional notes:
  - When choosing a LOCAL_UPLOAD_PATH, it is located based on the root of the repository, and the **directory must exist**.

# Filling out .env file

The only fields that matter are:

- HOST=[host of the machine, usually `localhost`]
- PORT=[port that the api will be hosted on, usually `3000`]
- DB_CONNECT="uri-of-mongodb"
- TOKEN_SECRET="can be any string"
- LOCAL_UPLOAD_PATH=[use "uploads/" as default]
