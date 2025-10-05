FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace configuration files
COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY turbo.json ./
COPY tooling ./tooling
COPY packages ./packages
COPY apps/admin/package.json ./apps/admin/package.json

RUN yarn install

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/yarn.lock ./yarn.lock
COPY --from=deps /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=deps /app/turbo.json ./turbo.json
COPY --from=deps /app/tooling ./tooling
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/admin ./apps/admin
COPY apps/admin ./apps/admin

# Copy environment variables for build (Clerk needs these during build)
COPY .env* ./

# Set build-time environment variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

RUN yarn turbo build --filter=admin...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/admin/next.config.js .
COPY --from=builder /app/apps/admin/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/admin/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public

# Copy environment variables to runtime
COPY --from=builder --chown=nextjs:nodejs /app/.env* ./

# Set environment variables for Next.js server
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

EXPOSE 3001

CMD ["node", "apps/admin/server.js"]