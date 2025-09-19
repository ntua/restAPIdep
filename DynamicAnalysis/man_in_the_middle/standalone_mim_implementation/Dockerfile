# Dockerfile

# Use an official Node runtime as the base image
FROM node:18.12.0

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Expose port 3000 for the API
EXPOSE 3000

# Define the command to run the app
ENTRYPOINT node server.js