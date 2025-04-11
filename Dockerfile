# Build stage
FROM node:20-alpine as builder

# Define build arguments
ARG VUE_APP_API_BASE_URL="http://localhost:3000"
ARG PORT=8080

WORKDIR /app

# Set environment variables from build arguments
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL
ENV PORT=$PORT

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Create .env file with build arguments
RUN echo "VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL" > .env && \
    echo "PORT=$PORT" >> .env

# Build the app
RUN npm run build

# Install production dependencies
RUN npm install --production

# Set environment variables
ENV NODE_ENV=production

# Expose the port
EXPOSE $PORT

# Start the server
CMD ["npm", "run", "serve"]