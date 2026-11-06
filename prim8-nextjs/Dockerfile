# syntax=docker/dockerfile:1

# Node version from .nvmrc / package.json#engines
ARG NODE_VERSION=26
# pnpm version from package.json#packageManager (corepack is no longer bundled with Node)
ARG PNPM_VERSION=11.15.1

# --- Dependencies ---
FROM node:${NODE_VERSION}-slim AS deps
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION} && npm cache clean --force
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM node:${NODE_VERSION}-slim AS builder
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION} && npm cache clean --force
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# src/env.ts validates env while Next collects page data, so the build gets the
# placeholders from .env.example (scoped to this command only; real values come at runtime)
RUN set -a && . ./.env.example && set +a && pnpm build

# --- Runtime ---
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# output: "standalone" bundles the server and only the node_modules it needs
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
