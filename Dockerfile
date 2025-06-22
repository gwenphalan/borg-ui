# Stage 1: Clone & Build the UI
FROM node:20-alpine AS builder

# Install git to fetch your repo
RUN apk add --no-cache git

WORKDIR /app
# Clone your repo right into /app
RUN git clone https://github.com/gwenphalan/borg-ui.git . 

# Install deps and build
RUN npm ci
RUN npm run build

# Stage 2: Serve with Caddy on port 2015
FROM caddy:2-alpine

# Copy built assets into /srv
COPY --from=builder /app/dist /srv

# Copy our Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 2015

ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
