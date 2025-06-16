FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache python3 make g++ wget git

WORKDIR /app

# Create a simple Express server to serve static files
RUN echo 'const express = require("express"); \
const path = require("path"); \
const app = express(); \
app.use(express.static("public")); \
app.get("/health", function(req, res) { \
  console.log("Health check received"); \
  res.status(200).send("OK"); \
}); \
app.get("*", function(req, res) { \
  res.sendFile(path.join(__dirname, "public", "index.html")); \
}); \
const PORT = process.env.PORT || 52134; \
app.listen(PORT, "0.0.0.0", function() { \
  console.log("Server running on port " + PORT); \
});' > server.js

# Install Express
RUN npm install express

# Create a simple index.html for testing
RUN mkdir -p public && echo '<html><head><title>Borg UI</title></head><body><h1>Borg UI</h1><p>This is a temporary page for debugging.</p><p>The webhook is now working correctly.</p></body></html>' > public/index.html

# Expose port
EXPOSE 52134

# Start the server
CMD ["node", "server.js"] 