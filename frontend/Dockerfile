# Use Node.js runtime
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
