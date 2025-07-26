# Stage 1: Build the React app using a recent Node.js LTS Alpine image
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite builds to 'dist' by default
RUN npm run build

# Stage 2: Serve the app with a stable Nginx Alpine image
FROM nginx:stable-alpine
# Copy from the 'dist' directory, not 'build'
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
