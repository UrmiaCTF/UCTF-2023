FROM	node:lts-bullseye-slim

ARG http_proxy
ARG https_proxy
ARG HTTP_PROXY
ARG HTTPS_PROXY

WORKDIR /usr/src/app

COPY 	package*.json ./

RUN 	npm cache verify

RUN 	npm install
RUN 	npm install -g nodemon

COPY 	. .


EXPOSE 49070

CMD [ "npm", "start" ]
