# Stage 1: Build the UI
FROM node:20-alpine AS builder
WORKDIR /app

# Get your source (with patched tsconfig.json)
RUN apk add --no-cache git
RUN git clone https://github.com/gwenphalan/borg-ui.git .

# Install deps & build
RUN npm ci
RUN npm run build

# Stage 2: Serve with Caddy on port 2015
FROM caddy:2-alpine

COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 2015

ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
