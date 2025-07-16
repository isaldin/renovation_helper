# PDF Worker Service

Сервис для асинхронной генерации PDF отчетов по расчету ремонта с отправкой в Telegram.

## 🎯 Описание

PDF Worker - это отдельный микросервис, который обрабатывает задачи генерации PDF отчетов из очереди Redis и отправляет готовые документы пользователям в Telegram чат.

## 🏗️ Архитектура

```
Backend API → Redis Queue → PDF Worker → Telegram Bot → User
```

### Компоненты:

- **PdfService** - генерация PDF из HTML шаблонов с помощью Puppeteer
- **TelegramService** - отправка PDF файлов в Telegram чаты
- **Queue Worker** - обработка задач из очереди Redis
- **Logger** - структурированное логирование

## 🚀 Установка и запуск

### Предварительные требования:

- Node.js 18+
- Redis Server
- Telegram Bot Token

### Установка зависимостей:

```bash
# Все зависимости уже установлены в root workspace
yarn install
```

### Переменные окружения:

Создайте `.env` файл в корне проекта:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Worker Configuration
WORKER_CONCURRENCY=2
LOG_LEVEL=info
NODE_ENV=development
```

### Запуск:

```bash
# Development mode
nx serve pdf-worker

# Production build
nx build pdf-worker

# Production start
node dist/pdf-worker/main.js
```

## 📋 Как работает

### 1. Получение задачи

Worker подключается к Redis очереди `pdf-generation` и ожидает новые задачи:

```typescript
interface PdfJobData {
  reportData: {
    companyInfo: {
      name: string;
      phone: string; 
      email: string;
    };
    reportInfo: {
      date: string;
      projectId?: string;
    };
    options: Array<{
      question: string;
      answer: string;
    }>;
    totalPrice: string;
    currency: string;
  };
  userId: string;
  calculatorId: string;
  telegramUserId: string;
  options?: PdfOptions;
}
```

### 2. Генерация PDF

- Загружает HTML шаблон из `/templates/renovation-report.hbs`
- Подставляет данные с помощью Handlebars
- Генерирует PDF с помощью Puppeteer
- Оптимизирует для печати

### 3. Отправка в Telegram

- Отправляет PDF файл пользователю в чат
- Добавляет подпись к документу
- Логирует успешную отправку

## 🎨 HTML Шаблон

Шаблон находится в `/templates/renovation-report.hbs` и включает:

- **Заголовок** с названием компании
- **Информацию о компании** (телефон, email, дата)
- **Таблицу опций** с вопросами и ответами
- **Итоговую стоимость** с выделением
- **Футер** с примечаниями

### Стили:

- Современный дизайн с градиентами
- Адаптивная верстка
- Оптимизация для PDF генерации
- Профессиональная цветовая схема

## 🔧 Настройка

### PDF Options:

```typescript
interface PdfOptions {
  format?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}
```

### Worker Configuration:

- `WORKER_CONCURRENCY` - количество параллельных задач (по умолчанию 2)
- `LOG_LEVEL` - уровень логирования (info, debug, warn, error)
- Автоматические повторы при ошибках (3 попытки)
- Экспоненциальная задержка между попытками

## 📊 Мониторинг

### Redis Setup для локальной разработки:

#### Запуск Redis в k3s кластере:

```bash
# 1. Создание/запуск k3d кластера
k3d cluster create dev-cluster --port "8080:80@loadbalancer" --port "8443:443@loadbalancer"

# 2. Деплой Redis
kubectl apply -f k8s/redis.yaml

# 3. Port forwarding для подключения воркера
kubectl port-forward svc/redis 6379:6379 &

# 4. Проверка статуса
kubectl get pods -l app=redis
kubectl get svc redis
```

#### Остановка Redis:

```bash
# Остановка port-forward
pkill -f "kubectl port-forward svc/redis"

# Удаление Redis из кластера
kubectl delete -f k8s/redis.yaml

# Остановка k3d кластера
k3d cluster stop dev-cluster

# Полное удаление кластера
k3d cluster delete dev-cluster
```

### Мониторинг Redis Queue:

#### 1. RedisInsight (GUI - рекомендуемый):

```bash
# Установка
brew install --cask redisinsight

# Подключение:
# Host: localhost
# Port: 6379
# Database: 0
```

В RedisInsight вы увидите:
- Все ключи Bull очереди (`bull:*`)
- Состояние джобов (waiting, active, completed, failed)
- Метрики производительности в реальном времени

#### 2. Командная строка:

```bash
# Подключение к Redis pod
kubectl exec -it $(kubectl get pods -l app=redis -o jsonpath='{.items[0].metadata.name}') -- redis-cli

# Основные команды для мониторинга очереди:
kubectl exec redis-pod -- redis-cli keys "bull:*"                    # Все ключи очереди
kubectl exec redis-pod -- redis-cli llen "bull:pdf-generation:wait" # Ожидающие джобы
kubectl exec redis-pod -- redis-cli llen "bull:pdf-generation:active" # Активные джобы
kubectl exec redis-pod -- redis-cli llen "bull:pdf-generation:completed" # Завершенные
kubectl exec redis-pod -- redis-cli llen "bull:pdf-generation:failed" # Провалившиеся

# Живой мониторинг команд
kubectl exec redis-pod -- redis-cli monitor

# Информация о сервере
kubectl exec redis-pod -- redis-cli info
```

#### 3. Полезные команды для отладки:

```bash
# Просмотр содержимого джоба
kubectl exec redis-pod -- redis-cli hgetall "bull:pdf-generation:123"

# Очистка всех очередей (осторожно!)
kubectl exec redis-pod -- redis-cli flushdb

# Проверка памяти Redis
kubectl exec redis-pod -- redis-cli info memory
```

### Логи воркера:

```bash
# Просмотр логов в реальном времени
nx serve pdf-worker

# Примеры логов:
[INFO] PDF Worker started queue=pdf-generation concurrency=2
[INFO] Processing PDF generation job jobId=12345
[INFO] PDF generated successfully jobId=12345 size=245760
[INFO] PDF sent to Telegram chatId=123456789 filename=renovation-report-calc123.pdf
```

### Метрики:

- Количество обработанных задач
- Время генерации PDF
- Успешность отправки в Telegram
- Ошибки и повторы

### Мониторинг в Lens:

После установки k3d кластер автоматически появится в Lens IDE:
- Визуальный мониторинг подов
- Просмотр логов Redis и воркера
- Метрики ресурсов (CPU, Memory)
- Управление сервисами через GUI

## 🚨 Обработка ошибок

### Типы ошибок:

1. **Template Loading Error** - ошибка загрузки HTML шаблона
2. **PDF Generation Error** - ошибка Puppeteer
3. **Telegram API Error** - ошибка отправки в Telegram
4. **Redis Connection Error** - ошибка подключения к очереди

### Retry Logic:

- 3 попытки для каждой задачи
- Экспоненциальная задержка: 2s, 4s, 8s
- Логирование всех попыток
- Перенос в failed queue после исчерпания попыток

## 🔄 Интеграция с Backend API

### Добавление задачи в очередь:

```typescript
// В report.controller.ts
await this.pdfQueueService.addPdfJob({
  reportData: transformedData,
  userId: 'user123',
  calculatorId: 'calc456', 
  telegramUserId: 'telegram789'
});
```

### Статус задачи:

```typescript
const status = await this.pdfQueueService.getJobStatus(jobId);
// Returns: { status: 'completed', result: { success: true, sent: true } }
```

## 🧪 Тестирование

### Запуск тестов:

```bash
# Unit tests
nx test pdf-worker

# Integration tests
nx test pdf-worker --coverage
```

### Тестовые сценарии:

- Генерация PDF с различными данными
- Отправка в Telegram с валидными/невалидными chatId
- Обработка ошибок и повторов
- Корректное завершение worker'а

## 📦 Деплой

### 🚀 Production Deployment

#### 1. Docker Compose (рекомендуемый способ):

```bash
# Быстрый деплой
./scripts/deploy-worker.sh

# Или напрямую
docker-compose -f docker-compose.prod.yml up -d

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f pdf-worker

# Остановка
docker-compose -f docker-compose.prod.yml down
```

#### 2. Systemd Service:

```bash
# Установка сервиса
sudo cp deployment/pdf-worker.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable pdf-worker.service

# Управление
sudo systemctl start pdf-worker
sudo systemctl status pdf-worker
sudo systemctl restart pdf-worker
sudo systemctl stop pdf-worker

# Логи
sudo journalctl -u pdf-worker -f
```

#### 3. Kubernetes Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pdf-worker
  labels:
    app: pdf-worker
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pdf-worker
  template:
    metadata:
      labels:
        app: pdf-worker
    spec:
      containers:
      - name: pdf-worker
        image: renovation-helper/pdf-worker:latest
        resources:
          limits:
            memory: "2Gi"
            cpu: "1000m"
          requests:
            memory: "1Gi"
            cpu: "500m"
        env:
        - name: REDIS_HOST
          value: "redis-service"
        - name: TELEGRAM_BOT_TOKEN
          valueFrom:
            secretKeyRef:
              name: telegram-secret
              key: bot-token
        livenessProbe:
          exec:
            command:
            - node
            - -e
            - "process.exit(0)"
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          exec:
            command:
            - node
            - -e
            - "process.exit(0)"
          initialDelaySeconds: 5
          periodSeconds: 10
```

#### 4. PM2 Process Manager:

```bash
# Установка PM2
npm install -g pm2

# Билд приложения
nx build pdf-worker --configuration=production

# Запуск с PM2
pm2 start pdf-worker/dist/main.js --name="pdf-worker" --instances=2

# Управление
pm2 restart pdf-worker
pm2 stop pdf-worker
pm2 delete pdf-worker

# Автозапуск при старте системы
pm2 save
pm2 startup

# Мониторинг
pm2 monit
pm2 logs pdf-worker
```

### 🔧 Production Configuration:

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    restart: always

  pdf-worker:
    build:
      context: .
      dockerfile: pdf-worker/Dockerfile
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=1536
      - WORKER_CONCURRENCY=2
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1'
        reservations:
          memory: 1G
          cpus: '0.5'
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 📊 Monitoring & Observability

#### 1. Health Checks:

```bash
# Docker health check
docker ps --format "table {{.Names}}\t{{.Status}}"

# Manual health check
curl -f http://localhost:3000/health || exit 1

# Redis connectivity
redis-cli ping
```

#### 2. Логирование:

```bash
# Docker logs
docker-compose -f docker-compose.prod.yml logs -f pdf-worker

# Systemd logs
sudo journalctl -u pdf-worker -f --lines=100

# PM2 logs
pm2 logs pdf-worker --lines 100

# Log rotation (для Docker)
docker system prune -f
```

#### 3. Метрики и мониторинг:

```yaml
# Prometheus + Grafana setup
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

#### 4. Alerting:

```yaml
# alerts.yml для Prometheus
groups:
- name: pdf-worker
  rules:
  - alert: PDFWorkerDown
    expr: up{job="pdf-worker"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "PDF Worker is down"
      
  - alert: HighMemoryUsage
    expr: container_memory_usage_bytes{name="pdf-worker"} / container_spec_memory_limit_bytes > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "PDF Worker high memory usage"
```

### 🔍 Troubleshooting

#### Общие проблемы:

```bash
# 1. Проверка статуса сервисов
docker-compose -f docker-compose.prod.yml ps

# 2. Проверка ресурсов
docker stats

# 3. Проверка Redis очереди
redis-cli
> LLEN pdf-generation
> LRANGE pdf-generation 0 -1

# 4. Проверка логов ошибок
docker-compose -f docker-compose.prod.yml logs pdf-worker | grep ERROR

# 5. Перезапуск воркера
docker-compose -f docker-compose.prod.yml restart pdf-worker
```

#### Performance tuning:

```bash
# Увеличение concurrency для высоких нагрузок
WORKER_CONCURRENCY=4

# Оптимизация Node.js memory
NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"

# Puppeteer оптимизации в коде
browser = await puppeteer.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--memory-pressure-off'
  ]
});
```

### 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy-worker.yml
name: Deploy PDF Worker
on:
  push:
    branches: [main]
    paths: ['pdf-worker/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and deploy
      run: |
        docker build -f pdf-worker/Dockerfile -t pdf-worker:${{ github.sha }} .
        docker tag pdf-worker:${{ github.sha }} pdf-worker:latest
        
    - name: Deploy to production
      run: |
        ssh user@server "cd /opt/renovation-helper && ./scripts/deploy-worker.sh"
```

## 🛠️ Разработка

### Структура проекта:

```
pdf-worker/
├── src/
│   ├── main.ts              # Точка входа worker'а
│   ├── services/
│   │   ├── pdf.service.ts   # Генерация PDF
│   │   └── telegram.service.ts # Отправка в Telegram
│   └── utils/
│       └── logger.ts        # Логирование
├── templates/
│   └── renovation-report.hbs # HTML шаблон
├── package.json
├── tsconfig.json
└── README.md
```

### Добавление новых функций:

1. **Новый тип отчета** - создать новый шаблон в `/templates/`
2. **Дополнительные каналы** - добавить новые сервисы в `/services/`
3. **Метрики** - интегрировать с Prometheus/Grafana

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи worker'а
2. Убедитесь, что Redis доступен
3. Проверьте валидность Telegram Bot Token
4. Проверьте права доступа к файлам шаблонов

## 🔄 Обновление

### Обновление зависимостей:

```bash
yarn upgrade
```

### Обновление шаблона:

1. Отредактируйте `/templates/renovation-report.hbs`
2. Перезапустите worker
3. Новые задачи будут использовать обновленный шаблон

---

**Создано:** 2025-07-10  
**Версия:** 1.0.0  
**Автор:** Renovation Helper Team