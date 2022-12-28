FROM node:18.12.1-alpine as build

WORKDIR .
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci --silent
COPY ./src/ ./src
COPY ./public/ ./public

# RUN npm run build

# # The second stage
# # Copy React static files and start nginx
# FROM nginx:stable-alpine
# COPY --from=build /app/frontend/build /usr/share/nginx/html
# CMD ["nginx", "-g", "daemon off;"]