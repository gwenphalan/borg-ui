FROM node:20-alpine AS builder

WORKDIR /app

# Install git, which is required by your build scripts.
RUN apk add --no-cache git

# Copy all source code from the build context.
# This uses the correct files on your server and DOES NOT clone from GitHub.
COPY . .

# Install dependencies and build the documentation site
RUN npm ci && npm run build:docs

# ---- Static server ----
FROM node:20-alpine

# Install serve to host the static site.
RUN npm install -g serve

# Set up the server directory.
WORKDIR /srv
COPY --from=builder /app/dist-docs .

# Serve the static site. The -s flag is for single-page applications.
EXPOSE 2015
CMD ["serve", "-s", "-l", "2015"]
