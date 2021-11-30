FROM node:12-alpine as build-step

WORKDIR /refreps-back-end

COPY package.json /refreps-back-end/utils

RUN npm install

COPY . /refreps-back-end

CMD [ "node","server.js" ]

