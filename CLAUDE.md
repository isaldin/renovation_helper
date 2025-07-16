# Renovation Helper Project - Claude Integration

## 📋 Project Overview

Renovation Helper - это full-stack приложение для расчета стоимости ремонта с генерацией PDF отчетов, построенное на современной микросервисной архитектуре.

## 🏗️ Architecture

```
Frontend (Vue.js) → Backend API (Fastify) → PDF Worker (Bull.js) → Telegram Bot
                        ↓                        ↓
                   Firebase/Firestore        Redis Queue
                        ↑
                   Company Data
```

## 📁 Project Structure

### Core Applications:
- `backend-api/` - REST API сервер (Fastify + TypeScript)
- `pdf-worker/` - PDF генерация воркер (Puppeteer + Bull.js)
- `web/` - Frontend приложение (Vue.js + Telegram WebApp)
- `bot/` - Telegram бот
- `common/` - Общие типы, сервисы и репозитории
- `libs/pdf-worker-types/` - Типы и константы для PDF Worker (NX Library)

### Key Technologies:
- **Backend**: Fastify, TypeScript, Firebase Admin, JWT
- **PDF**: Puppeteer, Handlebars, Bull Queue, Grammy
- **Frontend**: Vue.js, Pinia, Vite, Telegram WebApp
- **Database**: Firestore (NoSQL)
- **Queue**: Redis + Bull.js
- **Auth**: Telegram WebApp authentication
- **Monorepo**: NX Workspace with TypeScript Project References

## 🎯 Key Features

### 1. Calculator System
- Step-by-step renovation questionnaire
- Dynamic pricing calculation
- Multiple option types (boolean, select, number)

### 2. PDF Report Generation
- Beautiful HTML templates with Handlebars
- Asynchronous processing via worker queue
- Automatic delivery to Telegram chat

### 3. Authentication
- Telegram WebApp integration
- JWT token-based auth
- Domain-based company mapping

## 📝 Code Patterns

### Service Layer Pattern:
```typescript
@injectable()
export class CalculatorService {
  constructor(
    @inject(ServiceNames.CalculatorRepository) 
    private readonly repository: CalculatorRepository
  ) {}
  
  async getCalculator(id: string): Promise<Calculator> {
    return this.repository.findById(id);
  }
}
```

### Queue Job Pattern:
```typescript
interface PdfJobData {
  reportData: ReportData;
  userId: string;
  telegramUserId: string;
}

queue.process(async (job: Bull.Job<PdfJobData>) => {
  const pdf = await generatePdf(job.data.reportData);
  await sendToTelegram(job.data.telegramUserId, pdf);
});
```

### API Route Pattern:
```typescript
export async function report(fastify: FastifyInstance) {
  fastify.post('/report', {
    onRequest: [fastify.authenticate],
    schema: { body: reportRequestSchema }
  }, async (request, reply) => {
    // Process report generation
  });
}
```

## 🔧 Environment Variables

```env
# Backend API
TELEGRAM_BOT_TOKEN=bot_token
JWT_SECRET=secret_key
FIREBASE_PROJECT_ID=project_id

# PDF Worker  
REDIS_HOST=localhost
REDIS_PORT=6379
WORKER_CONCURRENCY=2

# Company Information (Deprecated)
# Company info now comes from API via Calculator.companyId
# No longer needed as environment variables
```

## 🚀 Development Commands

```bash
# Start all services
yarn api:serve          # Backend API server
yarn pdf-worker:serve   # PDF worker
yarn web:serve          # Frontend
yarn bot:serve          # Telegram bot

# Or with NX directly
yarn nx serve backend-api    # API server
yarn nx serve pdf-worker     # PDF worker
yarn nx serve web           # Frontend
yarn nx serve bot           # Telegram bot

# Build
yarn nx build backend-api
yarn nx build pdf-worker
yarn nx build @renovation-helper/pdf-worker-types

# Test
yarn nx test backend-api
yarn nx test pdf-worker

# Docker
docker-compose -f docker-compose.dev.yml up   # Development
docker-compose -f docker-compose.prod.yml up  # Production
```

## 🎨 PDF Template System

HTML templates in `/pdf-worker/templates/` using Handlebars:

```handlebars
{{#each options}}
<tr>
  <td class="question">{{this.question}}</td>
  <td class="answer">{{this.answer}}</td>
</tr>
{{/each}}

<div class="total-amount">{{totalPrice}} {{currency}}</div>
```

## 📊 Data Flow

1. **Calculator Setup**: Admin creates calculator with steps/options
2. **User Interaction**: User fills calculator via web interface  
3. **Data Storage**: Results saved to Firestore
4. **Report Request**: User requests PDF report
5. **Queue Processing**: Job added to Redis queue
6. **PDF Generation**: Worker processes job, generates PDF
7. **Delivery**: PDF sent to user's Telegram chat

## 🔍 Key Files for Context

### Types & Interfaces:
- `common/src/lib/types/calculator/` - Calculator domain types
- `common/src/lib/types/company.ts` - Company domain types
- `libs/pdf-worker-types/` - Shared PDF Worker types (NX Library)
- `pdf-worker/src/types/worker.types.ts` - PDF worker types (re-exports)

### Services:
- `backend-api/src/app/services/` - Business logic services
- `pdf-worker/src/services/` - PDF and Telegram services
- `common/src/lib/services/` - Shared domain services

### Repositories:
- `common/src/lib/repository/` - Repository interfaces and implementations
- `common/src/lib/repository/firebase/` - Firestore implementations

### Controllers:
- `backend-api/src/app/controllers/report/` - Report generation logic

### Templates:
- `pdf-worker/templates/renovation-report.hbs` - PDF template

## 🐛 Common Issues & Solutions

### PDF Generation:
- Puppeteer memory leaks → proper browser cleanup
- Template not found → check template path resolution
- Large PDF files → optimize image compression

### Queue Processing:
- Jobs stuck → check Redis connection
- Failed jobs → implement retry logic with exponential backoff
- Memory leaks → proper resource cleanup in workers

### Authentication:
- Invalid tokens → check JWT secret configuration
- CORS issues → verify frontend URL in CORS settings

## 🎯 Claude Integration Points

### 1. Code Review & Optimization:
- Analyze TypeScript code for improvements
- Suggest better error handling patterns
- Optimize database queries

### 2. Feature Development:
- Generate new calculator step types
- Create additional PDF templates
- Implement new API endpoints

### 3. Documentation:
- Generate API documentation
- Create user guides
- Write technical specifications

### 4. Testing:
- Generate unit tests
- Create integration test scenarios
- Mock data generation

---

**Last Updated**: 2025-07-10  
**Version**: 1.0.0  
**Maintainer**: Renovation Helper Team