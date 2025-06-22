FROM node:20-alpine AS builder

WORKDIR /app

# Install git, which is required by the build scripts
RUN apk add --no-cache git

# Clone the repository to ensure the .git directory is available for build scripts
RUN git clone https://github.com/gwenphalan/borg-ui.git .
RUN git config --global --add safe.directory /app

# Install dependencies and build the documentation site
RUN npm ci && npm run build:docs

# ---- Static server ----
FROM caddy:2-alpine

# Copy site from builder
COPY --from=builder /app/dist-docs /srv

# Caddyfile with try_files etc
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 2015
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
