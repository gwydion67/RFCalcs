FROM node:latest AS encore-app

WORKDIR /backend

COPY ./package.json .

RUN npm install

COPY . .

RUN curl -L https://encore.dev/install.sh | bash


