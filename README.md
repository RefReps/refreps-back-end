# refreps-back-end

Quick installation of API

- setup repo
- navigate to root of repo
- run `npm install` at root
- Also run `npm install -g nodemon` if you don't already have nodemon installed globally
- make a `.env` file at the root of the repo
- copy content of `sample.env` file into the new `.env` file
- fill out the contents of the `.env` file
- run `npm run devStart` to run the API server


# Filling out .env file

The only fields that matter are:

- HOST=[the host (usually `localhost`)]
- PORT=[port of the host (usually `3000` if available)]
- DB_CONNECT="uri-of-mongodb"
- TOKEN_SECRET="can-literally-be-any-string"
- ENVIRONMENT=[`dev` for bypassing all auth/user checks | `prod` for enforcing auth tokens/user checks]
