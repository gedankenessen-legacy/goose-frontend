# Build
FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . /usr/src/app
RUN npm run build --prod

# Run
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/Goose /usr/share/nginx/html