# Docker + GitHub Actions Deployment Guide

## 🎯 Architecture Overview

```
project-root/
├── mishwari-backend/          # Django (separate repo)
├── mishwari-monorepo/         # Node.js monorepo (this repo)
├── docker-compose.yml         # Orchestrates both
└── .github/workflows/         # Deployment automation
```

**Deployment Flow:**
```
GitHub Push → GitHub Actions → Build → Docker Images → Deploy to Server
```

**3 Services:**
- Backend (Django) - Port 8000
- Passenger Web (Next.js) - Port 3000
- Driver Web (Next.js) - Port 3001

---

## 📁 Project Structure & Required Files

### Repository Setup

**Option A: Separate Repositories (Recommended)**
```
├── mishwari-backend/          # Django repo
├── mishwari-monorepo/         # Node.js repo (this one)
└── mishwari-infrastructure/   # Deployment configs
```

**Option B: Single Project Root**
```
project-root/
├── mishwari-backend/          # Django codebase
├── mishwari-monorepo/         # Node.js monorepo
├── docker-compose.yml         # Root orchestration
├── docker-compose.dev.yml     # Development
└── .github/workflows/         # CI/CD
```

### 1. Root: `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build: ./mishwari-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_HOST=${DATABASE_HOST}
      - DATABASE_NAME=${DATABASE_NAME}
      - DATABASE_USER=${DATABASE_USER}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
      - DJANGO_SETTINGS_MODULE=mishwari_server.settings.production
    restart: unless-stopped
    networks:
      - mishwari-network

  passenger-web:
    build:
      context: ./mishwari-monorepo
      dockerfile: apps/passenger-web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-https://api.mishwari.ye/api/}
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - mishwari-network

  driver-web:
    build:
      context: ./mishwari-monorepo
      dockerfile: apps/driver-web/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-https://api.mishwari.ye/api/}
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - mishwari-network

networks:
  mishwari-network:
    driver: bridge
```

### 1b. Root: `docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  backend:
    build: ./mishwari-backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - DATABASE_HOST=${DATABASE_HOST:-localhost}
      - DATABASE_NAME=${DATABASE_NAME:-Mishwari-DB}
      - DATABASE_USER=${DATABASE_USER:-postgres}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
    volumes:
      - ./mishwari-backend:/app
    command: python manage.py runserver 0.0.0.0:8000
    networks:
      - mishwari-network

  passenger-web:
    build:
      context: ./mishwari-monorepo
      dockerfile: apps/passenger-web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/
    volumes:
      - ./mishwari-monorepo:/app
      - /app/node_modules
    command: pnpm --filter @mishwari/passenger-web-v2 dev
    depends_on:
      - backend
    networks:
      - mishwari-network

  driver-web:
    build:
      context: ./mishwari-monorepo
      dockerfile: apps/driver-web/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/
    volumes:
      - ./mishwari-monorepo:/app
      - /app/node_modules
    command: pnpm --filter @mishwari/driver-web dev
    depends_on:
      - backend
    networks:
      - mishwari-network

networks:
  mishwari-network:
    driver: bridge
```

### 2. Backend: `mishwari-backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "mishwari_server.wsgi:application"]
```

### 3. Frontend: `mishwari-monorepo/apps/passenger-web/Dockerfile`

```dockerfile
FROM node:18-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/passenger-web/package.json ./apps/passenger-web/
COPY packages/*/package.json ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages

# Copy source code
COPY . .

# Build packages and app
RUN pnpm build:packages
RUN pnpm --filter @mishwari/passenger-web-v2 build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application
COPY --from=builder /app/apps/passenger-web/.next/standalone ./
COPY --from=builder /app/apps/passenger-web/.next/static ./apps/passenger-web/.next/static
COPY --from=builder /app/apps/passenger-web/public ./apps/passenger-web/public

EXPOSE 3000

CMD ["node", "apps/passenger-web/server.js"]
```

### 4. Frontend: `mishwari-monorepo/apps/driver-web/Dockerfile`

```dockerfile
FROM node:18-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/driver-web/package.json ./apps/driver-web/
COPY packages/*/package.json ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages

# Copy source code
COPY . .

# Build packages and app
RUN pnpm build:packages
RUN pnpm --filter @mishwari/driver-web build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application
COPY --from=builder /app/apps/driver-web/.next/standalone ./
COPY --from=builder /app/apps/driver-web/.next/static ./apps/driver-web/.next/static
COPY --from=builder /app/apps/driver-web/public ./apps/driver-web/public

EXPOSE 3001

CMD ["node", "apps/driver-web/server.js"]
```

### 5. CI/CD: `.github/workflows/deploy.yml` (Root of project)

```yaml
name: Deploy Mishwari Services

on:
  push:
    branches: [main, develop]
  workflow_dispatch:

env:
  DEPLOY_PATH: /var/www/mishwari

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          submodules: recursive
      
      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
      
      - name: Deploy to server
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.DEPLOY_USER }}@${{ secrets.SERVER_IP }} << 'EOF'
            set -e
            
            # Navigate to deployment directory
            cd ${{ env.DEPLOY_PATH }}
            
            # Pull latest changes for both repos
            echo "📥 Pulling latest changes..."
            git pull origin main
            
            # Pull backend if it's a submodule or separate clone
            if [ -d "mishwari-backend" ]; then
              cd mishwari-backend
              git pull origin main
              cd ..
            fi
            
            # Stop services gracefully
            echo "🛑 Stopping services..."
            docker-compose down --remove-orphans
            
            # Build images
            echo "🔨 Building images..."
            docker-compose build --no-cache
            
            # Start services
            echo "🚀 Starting services..."
            docker-compose up -d
            
            # Health check
            echo "🏥 Health check..."
            sleep 30
            docker-compose ps
            
            # Cleanup old images
            echo "🧹 Cleaning up..."
            docker image prune -f
            
            echo "✅ Deployment completed!"
          EOF
      
      - name: Verify deployment
        run: |
          echo "🔍 Verifying deployment..."
          sleep 10
          curl -f http://${{ secrets.SERVER_IP }}:3000 || echo "⚠️ Passenger web not responding"
          curl -f http://${{ secrets.SERVER_IP }}:3001 || echo "⚠️ Driver web not responding"
          curl -f http://${{ secrets.SERVER_IP }}:8000/api/health || echo "⚠️ Backend API not responding"
```

### 6. Frontend CI: `mishwari-monorepo/.github/workflows/frontend-ci.yml`

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths: ['apps/**', 'packages/**']
  pull_request:
    branches: [main, develop]
    paths: ['apps/**', 'packages/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build packages
        run: pnpm build:packages
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Test
        run: pnpm test
      
      - name: Build apps
        run: |
          pnpm --filter @mishwari/passenger-web-v2 build
          pnpm --filter @mishwari/driver-web build
```

---

## 🔧 Server Setup (One-Time)

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Clone Repositories

**Option A: Separate Repos**
```bash
cd /var/www
mkdir mishwari && cd mishwari

# Clone backend
git clone <backend-repo-url> mishwari-backend

# Clone frontend monorepo
git clone <frontend-repo-url> mishwari-monorepo

# Clone infrastructure (optional)
git clone <infrastructure-repo-url> mishwari-infrastructure
```

**Option B: Single Project with Submodules**
```bash
cd /var/www
git clone --recursive <main-repo-url> mishwari
cd mishwari

# If submodules weren't cloned
git submodule update --init --recursive
```

### 3. Create Environment Files

```bash
# Root .env file
cat > .env << EOF
# Database
DATABASE_HOST=localhost
DATABASE_NAME=Mishwari-DB
DATABASE_USER=postgres
DATABASE_PASSWORD=your-secure-password

# API URLs
NEXT_PUBLIC_API_BASE_URL=https://api.mishwari.ye/api/

# Django
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=api.mishwari.ye,localhost

# Security
CORS_ALLOWED_ORIGINS=https://mishwari.ye,https://driver.mishwari.ye
EOF

# Backend specific .env
cat > mishwari-backend/.env << EOF
DATABASE_URL=postgresql://postgres:your-secure-password@localhost:5432/Mishwari-DB
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=api.mishwari.ye,localhost
EOF

# Frontend specific .env
cat > mishwari-monorepo/.env.local << EOF
NEXT_PUBLIC_API_BASE_URL=https://api.mishwari.ye/api/
EOF
```

### 4. Database Setup (if using local PostgreSQL)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE "Mishwari-DB";
CREATE USER postgres WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE "Mishwari-DB" TO postgres;
\q
EOF
```

### 5. Initial Build & Deploy

```bash
# Test configuration
docker-compose config

# Build all services
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 6. Nginx Configuration

```nginx
# /etc/nginx/sites-available/mishwari

# Backend API
server {
    listen 80;
    server_name api.mishwari.ye;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Passenger Web
server {
    listen 80;
    server_name mishwari.ye www.mishwari.ye;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Driver Web
server {
    listen 80;
    server_name driver.mishwari.ye;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mishwari /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mishwari.ye -d www.mishwari.ye
sudo certbot --nginx -d driver.mishwari.ye
sudo certbot --nginx -d api.mishwari.ye
```

---

## 🔐 GitHub Secrets Setup

**Repository Settings → Secrets → Actions:**

```
SSH_PRIVATE_KEY     = Your SSH private key (cat ~/.ssh/id_rsa)
DEPLOY_USER         = ubuntu (or your server user)
SERVER_IP           = Your server IP address
DEPLOY_PATH         = /var/www/mishwari
```

**Environment Secrets:**
```
DATABASE_HOST       = Your database host
DATABASE_PASSWORD   = Your database password
DJANGO_SECRET_KEY   = Your Django secret key
```

---

## 🚀 Deployment Flow

### Automatic (Push to main)

```bash
git add .
git commit -m "Update feature"
git push origin main
```

**What happens:**
1. GitHub Actions triggers
2. SSH into server
3. Pull latest code
4. Rebuild Docker images
5. Restart containers
6. ~5-10 minutes total

### Manual (On server)

```bash
cd /var/www/mishwari

# Pull all changes
git pull origin main
if [ -d "mishwari-backend" ]; then
  cd mishwari-backend && git pull origin main && cd ..
fi

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check status
docker-compose ps
```

---

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f passenger-web
docker-compose logs -f driver-web

# Last 100 lines
docker-compose logs --tail=100 backend

# Follow logs with timestamps
docker-compose logs -f -t passenger-web
```

### Health Checks

```bash
# Check all services status
docker-compose ps

# Check service health
curl http://localhost:8000/api/health
curl http://localhost:3000
curl http://localhost:3001

# Check resource usage
docker stats
```

### Restart Services

```bash
# Restart specific service
docker-compose restart backend
docker-compose restart passenger-web

# Restart all services
docker-compose restart

# Recreate containers
docker-compose up -d --force-recreate
```

---

## 🔄 Rollback Strategy

### Quick Rollback

```bash
cd /var/www/mishwari

# Find previous commit
git log --oneline -10

# Rollback to specific commit
git checkout <commit-hash>

# Rollback backend if separate repo
if [ -d "mishwari-backend" ]; then
  cd mishwari-backend
  git checkout <backend-commit-hash>
  cd ..
fi

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Image Backup Strategy

```bash
# Before deployment, backup current images
docker tag mishwari-backend:latest mishwari-backend:backup-$(date +%Y%m%d)
docker tag mishwari-passenger-web:latest mishwari-passenger-web:backup-$(date +%Y%m%d)
docker tag mishwari-driver-web:latest mishwari-driver-web:backup-$(date +%Y%m%d)

# Rollback to backup images
docker tag mishwari-backend:backup-20241118 mishwari-backend:latest
docker-compose up -d --no-deps backend
```

### Database Backup

```bash
# Backup database before deployment
docker exec mishwari-backend pg_dump -U postgres Mishwari-DB > backup-$(date +%Y%m%d).sql

# Restore database
docker exec -i mishwari-backend psql -U postgres Mishwari-DB < backup-20241118.sql
```

---

## 🎯 Optimization Tips

### 1. Multi-Stage Builds
- ✅ Reduces image size by 60-70%
- ✅ Faster deployments
- ✅ Better security (no build tools in production)

### 2. Build Caching Strategy

```dockerfile
# Copy package files first (cached layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile

# Then copy source (changes frequently)
COPY . .
RUN pnpm build
```

### 3. Selective Service Rebuilds

```bash
# Only rebuild changed services
docker-compose up -d --build passenger-web
docker-compose up -d --build backend

# Build specific service without cache
docker-compose build --no-cache driver-web
```

### 4. Production Optimizations

```yaml
# docker-compose.yml optimizations
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 🚨 Troubleshooting

### Build Issues

```bash
# Check build logs
docker-compose logs passenger-web
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache

# Build specific service with verbose output
docker-compose build --progress=plain backend

# Check Dockerfile syntax
docker build --dry-run -f apps/passenger-web/Dockerfile .
```

### Runtime Issues

```bash
# Check container status
docker-compose ps

# Inspect container
docker inspect mishwari-backend

# Execute commands in container
docker-compose exec backend python manage.py check
docker-compose exec passenger-web pnpm --version

# Check container resources
docker stats
```

### Network Issues

```bash
# Check port conflicts
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :8000

# Test internal connectivity
docker-compose exec passenger-web curl http://backend:8000/api/health

# Check network configuration
docker network ls
docker network inspect mishwari_mishwari-network
```

### Storage Issues

```bash
# Check disk usage
df -h
docker system df

# Clean up Docker resources
docker system prune -a --volumes
docker image prune -a
docker volume prune

# Remove specific images
docker rmi $(docker images -q mishwari-*)
```

### Database Issues

```bash
# Check database connection
docker-compose exec backend python manage.py dbshell

# Run migrations
docker-compose exec backend python manage.py migrate

# Check database logs
docker logs postgres-container
```

---

## 📈 Performance Expectations

### Build Times
- **First build**: 10-15 minutes (all services)
- **Incremental**: 3-7 minutes (changed services only)
- **With cache**: 1-3 minutes
- **Frontend only**: 2-4 minutes
- **Backend only**: 1-2 minutes

### Deployment Times
- **Code pull**: 10-30 seconds
- **Build**: 3-7 minutes (depending on changes)
- **Container restart**: 15-30 seconds
- **Health checks**: 30-60 seconds
- **Total**: 5-9 minutes

### Resource Usage (Production)
- **Django backend**: 200-400MB RAM, 0.5-1 CPU
- **Next.js passenger-web**: 150-300MB RAM, 0.3-0.7 CPU
- **Next.js driver-web**: 150-300MB RAM, 0.3-0.7 CPU
- **Total**: 500-1000MB RAM, 1.1-2.4 CPU cores

### Performance Benchmarks
- **Cold start**: 30-60 seconds
- **API response time**: <200ms
- **Frontend load time**: <3 seconds
- **Build cache hit rate**: 70-90%

---

## ✅ Pre-Deployment Checklist

### Server Setup
- [ ] Docker & Docker Compose installed
- [ ] Git installed and configured
- [ ] Nginx installed and configured
- [ ] PostgreSQL installed (if using local DB)
- [ ] SSL certificates obtained
- [ ] Firewall configured (ports 80, 443, 22)

### Repository Setup
- [ ] Backend repository cloned/accessible
- [ ] Frontend monorepo cloned
- [ ] Environment files created (`.env`, `.env.local`)
- [ ] Database credentials configured
- [ ] API URLs configured correctly

### GitHub/CI Setup
- [ ] GitHub secrets configured
- [ ] SSH keys added to server
- [ ] Deployment workflows tested
- [ ] Branch protection rules set

### DNS & SSL
- [ ] DNS records pointing to server
  - [ ] `mishwari.ye` → Server IP
  - [ ] `driver.mishwari.ye` → Server IP
  - [ ] `api.mishwari.ye` → Server IP
- [ ] SSL certificates valid and auto-renewing

### Testing
- [ ] Local build test: `docker-compose build`
- [ ] Local run test: `docker-compose up`
- [ ] Database connectivity test
- [ ] API endpoints responding
- [ ] Frontend apps loading
- [ ] Cross-service communication working

---

## 🎬 Quick Commands Reference

### Deployment
```bash
# Auto deploy
git push origin main

# Manual deploy
cd /var/www/mishwari
git pull && docker-compose up -d --build
```

### Service Management
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart services
docker-compose restart [service-name]

# Stop all
docker-compose down

# Start all
docker-compose up -d

# Rebuild specific service
docker-compose up -d --build backend
```

### Development
```bash
# Development mode
docker-compose -f docker-compose.dev.yml up

# Run commands in container
docker-compose exec backend python manage.py migrate
docker-compose exec passenger-web pnpm dev

# Shell access
docker-compose exec backend bash
docker-compose exec passenger-web sh
```

### Maintenance
```bash
# Clean up
docker system prune -a

# Update images
docker-compose pull
docker-compose up -d

# Backup database
docker-compose exec backend pg_dump -U postgres Mishwari-DB > backup.sql
```

---

## 💰 Cost Estimate

### Self-Hosted VPS
**Minimum Requirements:**
- 2 CPU cores, 4GB RAM, 50GB SSD
- **Cost: $20-40/month** (DigitalOcean, Linode, Vultr)

**Recommended:**
- 4 CPU cores, 8GB RAM, 100GB SSD
- **Cost: $40-80/month**

### Cloud Services Alternative
- **Backend**: AWS ECS/Railway ($15-30/month)
- **Frontend**: Vercel/Netlify (Free-$20/month)
- **Database**: AWS RDS/PlanetScale ($15-50/month)
- **CDN**: CloudFront ($5-15/month)
- **Total: $35-115/month**

### Hybrid Approach
- **Backend**: VPS ($20/month)
- **Frontend**: Vercel (Free tier)
- **Database**: Managed service ($15/month)
- **Total: $35/month**

---

---

## 🔍 Architecture Benefits

**This setup provides:**
- ✅ **Clean Separation**: Django and Node.js in separate environments
- ✅ **Technology Isolation**: Each stack uses its optimal tooling
- ✅ **Independent Scaling**: Scale backend and frontend separately
- ✅ **Team Autonomy**: Frontend and backend teams work independently
- ✅ **Coordinated Deployment**: Single command deploys entire stack
- ✅ **Easy Rollbacks**: Git-based rollback strategy
- ✅ **Centralized Logging**: All services in one place
- ✅ **Production Ready**: Multi-stage builds, health checks, monitoring

---

## 🚀 Next Steps

1. **Set up monitoring**: Add Prometheus + Grafana
2. **Implement caching**: Redis for sessions and API caching
3. **Add load balancing**: Nginx upstream for multiple instances
4. **Database optimization**: Connection pooling, read replicas
5. **Security hardening**: Fail2ban, automated backups, secrets management
6. **CI/CD enhancement**: Automated testing, staging environment

---

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt SSL](https://letsencrypt.org/getting-started/)

**Estimated setup time: 4-6 hours for experienced developers**ime:** 4-6 hours  
**Maintenance:** ~30 min/month

Your monorepo is ready. Just need to create the Docker files and GitHub Actions workflow. 🚀
