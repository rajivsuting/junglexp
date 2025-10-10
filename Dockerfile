FROM node:20-alpine AS base
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY turbo.json ./

# Copy all package.json files for workspace resolution
COPY apps/client/package.json ./apps/client/
COPY apps/admin/package.json ./apps/admin/
COPY packages/actions/package.json ./packages/actions/
COPY packages/db/package.json ./packages/db/
COPY packages/common-utils/package.json ./packages/common-utils/
COPY tooling/typescript-config/package.json ./tooling/typescript-config/

# Install all dependencies (disable PnP for Docker compatibility)
RUN yarn config set nodeLinker node-modules && \
    yarn install

# Build dependencies first
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Define build arguments (from Cloud Build)
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG CLERK_WEBHOOK_SECRET
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
ARG GCP_PROJECT_ID
ARG GCP_CLIENT_EMAIL
ARG GCP_PRIVATE_KEY
ARG GCP_BUCKET_NAME
ARG UPSTASH_REDIS_REST_URL
ARG UPSTASH_REDIS_REST_TOKEN


# Expose them as environment variables for runtime
ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    CLERK_SECRET_KEY=$CLERK_SECRET_KEY \
    CLERK_WEBHOOK_SECRET=$CLERK_WEBHOOK_SECRET \
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL \
    GCP_PROJECT_ID=$GCP_PROJECT_ID \
    GCP_CLIENT_EMAIL=$GCP_CLIENT_EMAIL \
    GCP_PRIVATE_KEY=$GCP_PRIVATE_KEY \
    GCP_BUCKET_NAME=$GCP_BUCKET_NAME \
    UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL \
    UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN


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

ENV PORT=3000
# Re-declare environment variables for runtime
ENV NODE_ENV=production \
    DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    CLERK_SECRET_KEY=$CLERK_SECRET_KEY \
    CLERK_WEBHOOK_SECRET=$CLERK_WEBHOOK_SECRET \
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL \
    GCP_PROJECT_ID=$GCP_PROJECT_ID \
    GCP_CLIENT_EMAIL=$GCP_CLIENT_EMAIL \
    GCP_PRIVATE_KEY=$GCP_PRIVATE_KEY \
    GCP_BUCKET_NAME=$GCP_BUCKET_NAME \
    UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL \
    UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN


CMD ["node", "apps/client/server.js"]
