# Stage 1: Runtime dependencies
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Final Image
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Security: Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 1. Copy standalone build (includes node_modules)
# Nx builds Next.js into dist/apps/front/.next/standalone
COPY --from=deps /app/node_modules ./node_modules
COPY dist/apps/front/.next/standalone ./
COPY dist/apps/front/.next/static ./dist/apps/front/.next/static
COPY dist/apps/front/public ./dist/apps/front/public

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Next.js standalone mode uses a specific server.js file
CMD ["node", "apps/front/server.js"]