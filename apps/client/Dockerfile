# apps/client/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable

# Install repo root deps (turborepo)
COPY package.json yarn.lock turbo.json .yarnrc.yml ./
COPY tooling ./tooling
COPY packages ./packages
COPY apps/client/package.json ./apps/client/package.json
COPY apps/admin/package.json ./apps/admin/package.json
RUN yarn install

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app .
COPY apps ./apps
RUN yarn turbo run build --filter=client

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PATH="/app/node_modules/.bin:$PATH"
RUN corepack enable

# Copy built app and dependencies
COPY --from=builder /app/apps/client/.next ./apps/client/.next
COPY --from=builder /app/apps/client/package.json ./apps/client/package.json
COPY --from=builder /app/apps/client/public ./apps/client/public
COPY --from=builder /app/apps/client/next.config.js ./apps/client/next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000
CMD ["yarn", "workspace", "client", "start"]
