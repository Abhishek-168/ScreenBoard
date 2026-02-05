FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat && apk update
WORKDIR /app
RUN npm install -g turbo pnpm
COPY . .
RUN turbo prune --scope=ws-backend --docker

FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN cd packages/db && npx prisma generate
RUN turbo run build --filter=ws-backend...

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer --chown=expressjs:nodejs /app .
ENV PORT=8080 NODE_ENV=production
EXPOSE 8080
CMD ["node", "apps/ws-backend/dist/index.js"]
