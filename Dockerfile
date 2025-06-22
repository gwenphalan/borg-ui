FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
RUN apk add --no-cache git

# Clone the repo (in case you're doing it manually inside Docker)
RUN git clone https://github.com/gwenphalan/borg-ui.git .

# FIX: Add safe Git directory
RUN git config --global --add safe.directory /app

# Install + build
RUN npm ci && npm run build:docs

# ---- Static server ----
FROM caddy:2-alpine

# Copy site from builder
COPY --from=builder /app/dist-docs /srv

# Caddyfile with try_files etc
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 2015
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
