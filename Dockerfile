# Stage 1: Build the UI
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Caddy on port 2015
FROM caddy:2-alpine

# Copy built assets into /srv
COPY --from=builder /app/dist /srv

# Copy our Caddyfile (see below)
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 2015

# Run Caddy with our config
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
