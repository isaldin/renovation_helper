# Renovation Helper

<div align="center">
  <h3>🏠 Full-Stack Renovation Cost Calculator</h3>
  <p>Vue.js • Fastify • Telegram WebApp • PDF Generation</p>
  
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45" alt="Nx Monorepo">
  <br><br>
</div>

## 📋 Overview

Renovation Helper - это современное full-stack приложение для расчета стоимости ремонта с автоматической генерацией PDF отчетов. Построено на микросервисной архитектуре с использованием NX монорепозитория.

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Web App   │───▶│ Backend API │───▶│ PDF Worker  │───▶│ Telegram    │
│  (Vue.js)   │    │ (Fastify)   │    │ (Puppeteer) │    │    Bot      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   ▼                   ▼                   │
       │            ┌─────────────┐    ┌─────────────┐             │
       │            │  Firebase   │    │   Redis     │             │
       │            │ (Firestore) │    │   Queue     │             │
       │            └─────────────┘    └─────────────┘             │
       │                                                           │
       └───────────────────────────────────────────────────────────┘
                           Telegram WebApp Integration
```

### 🎯 Key Features

- **🧮 Dynamic Calculator**: Step-by-step renovation cost calculation
- **📄 PDF Reports**: Beautiful PDF generation with custom templates
- **📱 Telegram Integration**: Native Telegram WebApp experience
- **🔐 JWT Authentication**: Secure token-based authentication
- **📊 Logging & Monitoring**: Comprehensive observability with structured logging
- **⚡ Real-time Processing**: Asynchronous PDF generation via Redis queues
- **🏢 Multi-tenant**: Company-based data isolation

## 🚀 Quick Start

### 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd renovation_helper

# Install dependencies
yarn install

# Setup environment variables (see .env.example)
cp .env.example .env
```

### 🗂️ Project Structure

```
renovation_helper/
├── backend-api/          # REST API server (Fastify + TypeScript)
├── pdf-worker/           # PDF generation worker (Puppeteer + Bull.js)
├── web/                  # Frontend application (Vue.js + Telegram WebApp)
├── bot/                  # Telegram bot
├── common/               # Shared types, services, repositories
├── libs/                 # Shared libraries (NX libs)
│   └── pdf-worker-types/ # PDF Worker type definitions
├── k8s/                  # Kubernetes manifests
└── scripts/              # Deployment and utility scripts
```

### 🏃 Development

```bash
# Start all services
yarn api:serve           # Backend API (http://localhost:3000)
yarn pdf-worker:serve    # PDF Worker
yarn web:serve           # Frontend (http://localhost:4200)
yarn bot:serve           # Telegram Bot

# With debug logging
LOG_LEVEL=debug yarn api:serve

# Build for production
yarn web:build
yarn api:build
yarn pdf-worker:build
```

### 🔧 Prerequisites

- **Node.js** 18+
- **Redis** (for PDF queue)
- **Firebase** project with Firestore
- **Telegram Bot** token

#### Redis Setup (Local Development)

```bash
# Using k3s cluster (recommended)
k3d cluster create dev-cluster --port "8080:80@loadbalancer" --port "8443:443@loadbalancer"
kubectl apply -f k8s/redis.yaml
kubectl port-forward svc/redis 6379:6379 &

# Or using Docker
docker run -d -p 6379:6379 redis:7-alpine
```

## 🔧 Configuration

### Environment Variables

```env
# Backend API
TELEGRAM_BOT_TOKEN=your_bot_token_here
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_firebase_project
LOG_LEVEL=info

# PDF Worker
REDIS_HOST=localhost
REDIS_PORT=6379
WORKER_CONCURRENCY=2

# Development
NODE_ENV=development
```

### Firebase Setup

1. Create Firebase project
2. Enable Firestore database
3. Download service account key
4. Set `FIREBASE_PROJECT_ID` in environment

### Telegram Bot Setup

1. Create bot via [@BotFather](https://t.me/botfather)
2. Get bot token
3. Set `TELEGRAM_BOT_TOKEN` in environment
4. Configure webhook URL for production

## 📊 Features

### Calculator System
- **Dynamic Steps**: Boolean, select, checkbox, number input types
- **Conditional Logic**: Step flow based on user answers
- **Price Calculation**: Real-time cost calculation
- **Company Branding**: Multi-tenant company support

### PDF Report Generation
- **Handlebars Templates**: Customizable HTML templates
- **Asynchronous Processing**: Queue-based generation with Bull.js
- **Professional Design**: Modern, printable PDF layouts
- **Automatic Delivery**: Direct send to Telegram chat

### Authentication & Security
- **Telegram WebApp**: Native Telegram integration
- **JWT Tokens**: Secure stateless authentication
- **HTTP-only Cookies**: XSS protection
- **Domain-based Routing**: Company isolation

### Observability & Monitoring
- **Structured Logging**: JSON logs with Pino
- **Correlation IDs**: Request tracing across services
- **Performance Metrics**: Counters, timers, histograms
- **Error Tracking**: Comprehensive error classification
- **Health Checks**: Service availability monitoring

## 🚀 Deployment

### Docker Compose (Recommended)

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Development
docker-compose -f docker-compose.dev.yml up

# Quick deployment script
./scripts/deploy-worker.sh
```

### Kubernetes

```bash
# Deploy to k8s cluster
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl logs -f deployment/backend-api
```

### Manual Deployment

```bash
# Build applications
yarn nx build backend-api --configuration=production
yarn nx build pdf-worker --configuration=production
yarn nx build web --configuration=production

# Start services
PORT=3000 node backend-api/dist/main.js
node pdf-worker/dist/main.js
```

## 🧪 Testing

```bash
# Unit tests
yarn nx test backend-api
yarn nx test pdf-worker
yarn nx test web

# Integration tests
yarn nx test backend-api --coverage

# E2E tests
yarn nx e2e web-e2e
```

## 📖 Documentation

- [**CLAUDE.md**](./CLAUDE.md) - Development guide and architecture
- [**PDF Worker Guide**](./pdf-worker/README.md) - PDF generation service
- [**Logging & Monitoring**](./backend-api/LOGGING_AND_MONITORING.md) - Observability setup
- [**API Documentation**](./backend-api/docs/) - REST API reference

## 🛠️ Development Tools

### NX Commands

```bash
# Project graph visualization
npx nx graph

# Run specific target
npx nx <target> <project-name>

# Build all projects
npx nx run-many --target=build

# TypeScript project references sync
npx nx sync
```

### Monitoring Tools

- **RedisInsight** - Redis queue monitoring
- **Lens** - Kubernetes cluster management
- **Pino Pretty** - Pretty-print structured logs

## 🔍 Troubleshooting

### Common Issues

1. **PDF Worker not processing jobs**
   ```bash
   # Check Redis connection
   redis-cli ping
   kubectl port-forward svc/redis 6379:6379
   ```

2. **Authentication errors**
   ```bash
   # Verify JWT secret and Telegram bot token
   echo $JWT_SECRET
   echo $TELEGRAM_BOT_TOKEN
   ```

3. **Build errors**
   ```bash
   # Clean and rebuild
   yarn nx reset
   yarn nx run-many --target=build
   ```

## 📞 Support

For issues and questions:

1. Check [documentation](./CLAUDE.md)
2. Review logs: `LOG_LEVEL=debug yarn api:serve`
3. Verify environment configuration
4. Check service health endpoints

## 🎯 Technology Stack

- **Frontend**: Vue.js 3, Pinia, Naive UI, Vite
- **Backend**: Fastify 5, TypeScript, Firebase Admin
- **Queue**: Redis, Bull.js
- **PDF**: Puppeteer, Handlebars
- **Auth**: JWT, Telegram WebApp
- **Database**: Firestore (NoSQL)
- **Logging**: Pino, structured JSON
- **Monitoring**: Custom metrics, correlation IDs
- **DevOps**: Docker, Kubernetes, NX Monorepo

---

**Version**: 1.0.0  
**Last Updated**: 2025-07-16  
**Maintainer**: isaldin
