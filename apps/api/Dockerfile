FROM node:24.10.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24.10.0-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=deps /app/node_modules ./node_modules
COPY dist/apps/api .

RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "main.js"]