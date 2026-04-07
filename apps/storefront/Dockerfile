# Production Dockerfile for Next.js Frontend
FROM node:20-alpine

WORKDIR /app

# Install bun
RUN npm install -g bun@1.3.5

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application
RUN bun run build

# Expose port
EXPOSE 8000

# Start Next.js in standalone mode
CMD ["bun", "run", "start"]
