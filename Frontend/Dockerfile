FROM node:latest AS vite-app

WORKDIR /app

COPY ./package.json .

RUN yarn install

COPY . .

RUN yarn build

# Stage-2
FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static contain
COPY ./nginx/nginx.conf /etc/nginx
COPY --from=vite-app ./app/dist /usr/share/nginx/html

# Open the port to react
EXPOSE 8080

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
