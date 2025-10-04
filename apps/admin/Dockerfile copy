# apps/admin/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable

# Install repo root deps (turborepo)
COPY package.json yarn.lock turbo.json .yarnrc.yml ./
COPY tooling ./tooling
COPY packages ./packages
COPY apps/admin/package.json ./apps/admin/package.json
RUN yarn install

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app .
COPY apps ./apps
RUN yarn turbo run build --filter=admin...

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PATH="/app/node_modules/.bin:$PATH"
RUN corepack enable

# Copy built app and dependencies
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/apps/admin/package.json ./apps/admin/package.json
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder /app/apps/admin/next.config.js ./apps/admin/next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000
CMD ["yarn", "workspace", "admin", "start"]
