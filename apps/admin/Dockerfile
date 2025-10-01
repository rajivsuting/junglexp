# apps/admin/Dockerfile (same pattern for apps/web)
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY . .
RUN npm install -g turbo yarn

# Build only this app
RUN turbo prune --scope=admin --docker
RUN yarn install
RUN yarn turbo run build --filter=admin...

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/apps/admin/.next ./.next
COPY --from=builder /app/apps/admin/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080
CMD ["npm", "start"]
