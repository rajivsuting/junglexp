# apps/admin/Dockerfile (same pattern for apps/web)
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY . .
RUN npm install -g turbo pnpm

# Build only this app
RUN turbo prune --scope=web-new --docker
RUN yarn install
RUN yarn turbo run build --filter=admin...

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/apps/web-new/.next ./.next
COPY --from=builder /app/apps/web-new/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080
CMD ["npm", "start"]
