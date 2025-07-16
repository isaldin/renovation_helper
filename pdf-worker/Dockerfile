# Multi-stage Production Dockerfile for PDF Worker

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY pdf-worker/package.json ./pdf-worker/
COPY tsconfig.base.json ./
COPY pdf-worker/tsconfig.app.json ./pdf-worker/
COPY pdf-worker/tsconfig.json ./pdf-worker/

# Install all dependencies (including dev dependencies for building)
RUN yarn install --frozen-lockfile

# Copy source code
COPY pdf-worker/src ./pdf-worker/src
COPY common ./common

# Build the application
RUN yarn nx build pdf-worker --configuration=production

# Production stage
FROM node:20-alpine AS production

# Install necessary packages for Puppeteer and Chrome
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json yarn.lock ./
COPY pdf-worker/package.json ./pdf-worker/
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/pdf-worker/dist ./pdf-worker/dist

# Copy templates and assets
COPY pdf-worker/templates ./pdf-worker/templates
COPY pdf-worker/src/assets ./pdf-worker/src/assets

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S worker -u 1001

# Change ownership of the app directory
RUN chown -R worker:nodejs /app
USER worker

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "process.exit(0)" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the production application
CMD ["node", "pdf-worker/dist/main.js"]