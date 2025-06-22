FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application's source code
COPY . .

# Build the docs
RUN npm run build:docs

# ---- Static server ----
FROM caddy:2-alpine

# Copy site from builder
COPY --from=builder /app/dist-docs /srv

# Caddyfile with try_files etc
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 2015
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
