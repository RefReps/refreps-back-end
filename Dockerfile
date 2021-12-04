FROM node:14.18.1 as builder

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

FROM node

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD [ "npm","run", "devStart" ]

