# Stage 1: Build the UI
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy src, public, scripts, etc.
COPY . .

# Build using your defined script (runs prebuild + tsc + vite build)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

# Copy the built UI into Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: support SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
