FROM node:latest AS encore-app

WORKDIR /backend

COPY ./package.json .

RUN npm install

RUN curl -L https://encore.dev/install.sh | bash

COPY . .

EXPOSE 4000
EXPOSE 9400

CMD ["/root/.encore/bin/encore" ,"run", "--listen", "0.0.0.0"]
