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
FROM caddy:2-alpine

# Copy site from builder
COPY --from=builder /app/dist-docs /srv

# Caddyfile is copied from the context
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 2015
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
