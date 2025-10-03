# apps/admin/Dockerfile (same pattern for apps/web)
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Install repo root deps (turborepo)
COPY package.json yarn.lock turbo.json ./
COPY tooling ./tooling
COPY packages ./packages
COPY apps/admin/package.json ./apps/admin/package.json
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app .
COPY apps ./apps
RUN yarn turbo run build --filter=admin...

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and only its production deps
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/apps/admin/package.json ./apps/admin/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/admin/public ./apps/admin/public

WORKDIR /app/apps/admin
EXPOSE 3001
CMD ["yarn", "start"]
