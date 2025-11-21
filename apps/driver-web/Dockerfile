FROM node:18-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy everything (node_modules excluded via .dockerignore)
COPY . .

# Install all dependencies at root
RUN pnpm install --frozen-lockfile

# Build packages with TypeScript in non-strict mode
RUN cd packages/types && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/utils && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/api && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/ui-primitives && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/ui-web && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/features/auth && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/features/bookings && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/features/passengers && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/features/profile && (pnpm build || npx tsc --noEmitOnError false || true)
RUN cd packages/features/trips && (pnpm build || npx tsc --noEmitOnError false || true)

# Build driver web
RUN pnpm --filter @mishwari/driver-web build

FROM node:18-alpine AS runner
RUN npm install -g pnpm
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/driver-web ./apps/driver-web
COPY --from=builder /app/packages ./packages

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

WORKDIR /app/apps/driver-web

EXPOSE 3001

CMD ["pnpm", "start"]
