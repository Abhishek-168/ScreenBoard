FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat && apk update
WORKDIR /app

# Install turbo & pnpm
RUN npm install turbo pnpm --global
COPY . .

# ✂️ MAGIC: Prune only what 'ws-backend' needs
RUN turbo prune --scope=ws-backend --docker

# --- INSTALL STAGE ---
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# ⚡ GENERATE PRISMA CLIENT (Crucial for DB access)
RUN cd packages/db && npx prisma generate

# 🏗️ BUILD WS-BACKEND
RUN turbo run build --filter=ws-backend...

# --- RUNNER STAGE ---
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer --chown=expressjs:nodejs /app .

# Render sets the PORT env var automatically
ENV PORT=8080 NODE_ENV=production
EXPOSE 8080

# 🚀 START COMMAND (Ensure this path matches your build output)
CMD ["node", "apps/ws-backend/dist/index.js"]
