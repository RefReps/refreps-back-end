FROM node:16.5.0-alpine as builder

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

FROM node:16.5.0-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD [ "npm","run", "start" ]

