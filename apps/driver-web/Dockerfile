FROM node:18-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy everything (node_modules excluded via .dockerignore)
COPY . .

# Install all dependencies at root
RUN pnpm install --frozen-lockfile

# Set API URL for build
ARG NEXT_PUBLIC_API_BASE_URL=https://api.mishwari.online/api/
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Firebase configuration for build
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

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
