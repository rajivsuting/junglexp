FROM node:20-alpine AS base
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files from repository root
COPY ../../package.json ./package.json
COPY ../../yarn.lock ./yarn.lock
COPY ../../turbo.json ./turbo.json

# Copy all package.json files for workspace resolution
COPY ../../apps/client/package.json ./apps/client/package.json
COPY ../../apps/admin/package.json ./apps/admin/package.json
COPY ../../packages/actions/package.json ./packages/actions/package.json
COPY ../../packages/db/package.json ./packages/db/package.json
COPY ../../packages/common-utils/package.json ./packages/common-utils/package.json

# Install all dependencies
RUN yarn install

# Build dependencies first
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY ../../. .

# Build the client app specifically
RUN yarn turbo build --filter=client

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/client/server.js"]