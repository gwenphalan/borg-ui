FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache python3 make g++ wget

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Create a simple Express server to serve the built files
RUN echo 'const express = require("express"); const path = require("path"); const app = express(); app.use(express.static("dist")); app.get("/health", (req, res) => res.status(200).send("OK")); app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html"))); app.listen(52134, "0.0.0.0", () => console.log("Server running on port 52134"));' > server.js

# Install Express
RUN yarn add express

# Expose port
EXPOSE 52134

# Start the server
CMD ["node", "server.js"] 