# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

ARG REACT_APP_USERS

ENV REACT_APP_USERS $REACT_APP_USERS

# Build the React app
RUN npm run build

# Set environment variable
ENV NODE_ENV=production

# Expose the port where the app will run
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
