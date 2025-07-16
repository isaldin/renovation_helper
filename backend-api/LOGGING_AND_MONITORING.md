# Logging and Monitoring System

## 📋 Overview

Comprehensive logging, monitoring, and error tracking system for the Renovation Helper backend API, built with structured logging, distributed tracing, and performance metrics collection.

## 🏗️ Architecture

```
Request → Correlation ID → Structured Logs → Metrics → Error Tracking → Monitoring Dashboard
    ↓
AsyncLocalStorage Context → Child Loggers → Audit Trails
```

## 🔧 Components

### 1. Request Tracking Middleware
**File**: `src/app/middleware/requestTracking.middleware.ts`

Automatically tracks all incoming requests with:
- **Correlation ID**: Unique identifier for request tracing
- **Request Context**: User ID, IP, User-Agent, timing
- **Response Headers**: Correlation ID in response
- **Duration Tracking**: Request processing time

```typescript
// Auto-attached to every request
interface RequestContext {
  correlationId: string;
  userId?: string;
  userAgent?: string;
  ip: string;
  method: string;
  url: string;
  startTime: number;
}
```

### 2. Enhanced Logger
**File**: `src/app/utils/logger.ts`

Advanced structured logging with contextual information:

#### Features:
- **AsyncLocalStorage**: Maintains context across async operations
- **Structured Logging**: JSON format with Pino
- **Context Inheritance**: Child loggers with additional context
- **Performance Timing**: Built-in timing utilities
- **Error Stack Traces**: Detailed error logging
- **Audit Logging**: Special logging for important business actions

#### Usage Examples:

```typescript
// Basic logging with automatic context
logger.info('User action completed', { action: 'create_report' });

// Error logging with stack trace
logger.errorWithStack(error, 'Failed to process request');

// Performance timing
const timer = logger.time('database_query');
// ... operation
timer.end('Query completed');

// Audit logging for important actions
logger.audit('User created report', { userId, reportId });

// Set context for subsequent logs
logger.setContext({ operation: 'generateReport', calculatorId });

// Child logger with additional context
const childLogger = logger.child({ component: 'pdf-service' });
```

### 3. Logging Plugin
**File**: `src/app/plugins/logging.plugin.ts`

Fastify plugin that automatically logs all HTTP requests and responses:

#### Features:
- **Automatic Request/Response Logging**: No manual instrumentation needed
- **Sensitive Data Sanitization**: Removes passwords, tokens, secrets
- **Configurable Body Logging**: Optional request/response body logging
- **Excluded Paths**: Skip logging for health checks, metrics endpoints
- **Error Logging**: Automatic error capture and logging

#### Configuration:

```typescript
// Register the plugin
await fastify.register(loggingPlugin, {
  excludePaths: ['/health', '/metrics'],
  logRequestBody: true,
  logResponseBody: false,
  maxBodySize: 1024, // 1KB
});
```

### 4. Metrics System
**File**: `src/app/utils/metrics.ts`

Comprehensive performance and business metrics collection:

#### Metric Types:
- **Counters**: Incrementing values (requests, errors)
- **Gauges**: Current values (memory usage, active connections)
- **Histograms**: Value distributions (response times, file sizes)
- **Timers**: Duration measurements with statistics

#### Built-in Metrics:
- **HTTP Metrics**: Request count, duration, status codes
- **Database Metrics**: Query count, duration, errors
- **PDF Generation**: Success rate, duration, file sizes
- **System Metrics**: Memory, CPU usage (collected every 30s)

#### Usage Examples:

```typescript
// Counter metrics
metrics.increment('user_registrations', 1, { source: 'web' });

// Gauge metrics
metrics.gauge('active_connections', connectionCount, 'count');

// Histogram metrics
metrics.histogram('response_time', duration, { endpoint: '/api/report' });

// Timer utility
const timer = metrics.timer('pdf_generation');
// ... operation
timer.end();

// Decorator for automatic timing
@timed('database_operation', { table: 'users' })
async getUserById(id: string) {
  // Automatically timed and recorded
}

// Specialized metrics
metrics.recordHttpRequest('POST', '/api/report', 200, 150);
metrics.recordDbOperation('findOne', 'users', 25, true);
metrics.recordPdfGeneration(3000, true, 245760);
```

#### Histogram Statistics:
```typescript
const stats = metrics.getHistogramStats('response_time');
// Returns: { count, min, max, mean, p50, p90, p95, p99 }
```

### 5. Error Tracking System
**File**: `src/app/utils/errorTracking.ts`

Advanced error tracking with classification and alerting:

#### Features:
- **Error Classification**: Low, Medium, High, Critical severity
- **Automatic Alerts**: Critical errors trigger immediate alerts
- **Error Rate Monitoring**: Detects error spikes
- **Categorized Tracking**: Business, validation, database, API errors
- **Error Statistics**: Frequency analysis and trending

#### Usage Examples:

```typescript
// Generic error tracking
errorTracker.track(error, { 
  operation: 'generateReport',
  component: 'report-service' 
}, 'high');

// Business logic errors
errorTracker.trackBusinessError(
  'createUser', 
  'User already exists',
  { email: user.email }
);

// Validation errors
errorTracker.trackValidationError(
  'email', 
  invalidEmail, 
  'Invalid email format'
);

// Database errors
errorTracker.trackDbError(
  'insert', 
  'users', 
  dbError,
  { userId }
);

// External API errors
errorTracker.trackApiError(
  'telegram', 
  '/sendMessage',
  apiError
);

// Decorator for automatic error tracking
@trackErrors('generateReport', 'report-controller', 'high')
async generateReport() {
  // Automatically tracked if error occurs
}
```

#### Error Statistics:
```typescript
const stats = errorTracker.getErrorStats();
// Returns comprehensive error analytics
```

### 6. Monitoring Endpoints
**File**: `src/app/routes/monitoring.ts`

RESTful endpoints for system monitoring and observability:

#### Available Endpoints:

**GET /health**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-11T18:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production"
}
```

**GET /metrics**
```json
{
  "uptime": 3600000,
  "memory": { "rss": 150, "heapUsed": 45, "heapTotal": 67 },
  "cpu": { "user": 1000000, "system": 200000 },
  "counters": { "http_requests_total": 1543 },
  "histograms": { "response_time": { "p95": 120, "p99": 250 } }
}
```

**GET /errors**
```json
{
  "total": 23,
  "last24h": 5,
  "lastHour": 1,
  "bySeverity": { "high": 2, "medium": 3 },
  "byComponent": { "database": 3, "api": 2 },
  "topErrors": [{ "error": "ValidationError: Invalid email", "count": 8 }]
}
```

**GET /system**
```json
{
  "node": { "version": "v18.17.0", "platform": "linux" },
  "memory": { "heapUsedPercentage": 67 },
  "cpu": { "user": 1500000, "system": 300000 },
  "uptime": 3600,
  "pid": 12345
}
```

**POST /log-level**
```json
{ "level": "debug" }
```

## 🚀 Implementation Guide

### Step 1: Register Plugins

In your main application file (`app.ts`):

```typescript
import loggingPlugin from './plugins/logging.plugin';
import { monitoring } from './routes/monitoring';

// Register logging plugin
await fastify.register(loggingPlugin, {
  excludePaths: ['/health', '/metrics'],
  logRequestBody: process.env.NODE_ENV === 'development',
  logResponseBody: false,
});

// Register monitoring routes
await fastify.register(monitoring);
```

### Step 2: Enhanced Controller Example

```typescript
import { logger, metrics, errorTracker, timed, trackErrors } from '../utils';

@injectable()
export class ReportController {
  @timed('report_generation')
  @trackErrors('generateReport', 'report-controller', 'high')
  async generateReport(request: FastifyRequest, reply: FastifyReply) {
    // Set operation context
    logger.setContext({
      operation: 'generateReport',
      component: 'report-controller',
      calculatorId: request.body.calculatorId,
    });

    logger.info('Report generation started');

    try {
      // Database operation with timing
      const dbTimer = metrics.timer('db_calculator_fetch');
      const calculator = await this.calculatorService.getCalculator(id);
      dbTimer.end();

      if (!calculator) {
        errorTracker.trackBusinessError(
          'generateReport',
          `Calculator not found: ${id}`
        );
        throw new CalculatorNotFoundError(id);
      }

      // Success metrics
      metrics.increment('reports_generated', 1, { 
        type: calculator.type 
      });

      logger.audit('Report generated successfully', {
        calculatorId: id,
        userId: request.user.userId,
      });

      return reply.send({ success: true });

    } catch (error) {
      // Error automatically tracked by @trackErrors decorator
      metrics.increment('report_errors', 1);
      throw error;
    }
  }
}
```

### Step 3: Environment Configuration

```env
# Logging
LOG_LEVEL=info
NODE_ENV=production

# Monitoring
ENABLE_METRICS=true
METRICS_INTERVAL=30000
```

## 📊 Log Output Examples

### Request Lifecycle:
```json
{"level":"info","msg":"Request started","correlationId":"uuid-123","method":"POST","url":"/api/report"}
{"level":"info","msg":"Report generation started","correlationId":"uuid-123","operation":"generateReport"}
{"level":"debug","msg":"Calculator found","correlationId":"uuid-123","calculatorName":"Kitchen Renovation"}
{"level":"info","msg":"AUDIT: Report generated","correlationId":"uuid-123","audit":true,"userId":"user-123"}
{"level":"info","msg":"Request completed","correlationId":"uuid-123","statusCode":200,"duration":145}
```

### Error Tracking:
```json
{"level":"error","msg":"Error tracked [high]","correlationId":"uuid-123","severity":"high","errorType":"DatabaseError","operation":"generateReport","component":"report-controller","error":{"name":"DatabaseError","message":"Connection timeout","stack":"..."}}
```

### Performance Metrics:
```json
{"level":"info","msg":"Operation completed: report_generation","correlationId":"uuid-123","operation":"report_generation","duration":145,"performance":true}
```

## 🎯 Benefits

### Operational Benefits:
- **Distributed Tracing**: Follow requests across services with correlation IDs
- **Performance Monitoring**: Identify bottlenecks and optimize slow operations
- **Error Analytics**: Understand error patterns and failure rates
- **Business Intelligence**: Track business metrics and user behavior
- **Proactive Alerting**: Get notified of critical issues immediately

### Development Benefits:
- **Debugging**: Rich context in logs makes debugging easier
- **Testing**: Monitor test performance and identify issues
- **Code Quality**: Automatic error tracking encourages better error handling
- **Documentation**: Audit logs serve as business action documentation

### Production Benefits:
- **SLA Monitoring**: Track response times and availability
- **Capacity Planning**: Monitor resource usage and scaling needs
- **Incident Response**: Rich logs and metrics for faster resolution
- **Compliance**: Audit trails for regulatory requirements

## 🔍 Monitoring Integration

### External Systems Integration:

**Grafana Dashboard**:
```bash
# Query metrics endpoint for visualization
curl http://api.domain.com/metrics
```

**Alerting Systems**:
```javascript
// Webhook integration for critical alerts
if (errorReport.severity === 'critical') {
  await fetch('https://hooks.slack.com/webhook', {
    method: 'POST',
    body: JSON.stringify({
      text: `🚨 Critical Error: ${errorReport.error.message}`,
      attachments: [{
        color: 'danger',
        fields: [
          { title: 'Correlation ID', value: errorReport.context.correlationId },
          { title: 'Component', value: errorReport.context.component },
          { title: 'User ID', value: errorReport.context.userId }
        ]
      }]
    })
  });
}
```

**Log Aggregation** (ELK Stack, Datadog, etc.):
```json
// Structured logs are ready for aggregation
{
  "timestamp": "2025-07-11T18:00:00.000Z",
  "level": "info",
  "correlationId": "uuid-123",
  "component": "report-controller",
  "operation": "generateReport",
  "userId": "user-123",
  "msg": "Report generation completed"
}
```

## 🛠️ Troubleshooting

### Common Issues:

**High Memory Usage**:
```bash
# Check metrics endpoint
curl http://localhost:3000/metrics | jq '.memory'

# Look for memory leaks in logs
grep "memory" logs/app.log
```

**Performance Issues**:
```bash
# Check slow operations
curl http://localhost:3000/metrics | jq '.histograms | to_entries | .[] | select(.value.p95 > 1000)'
```

**Error Spikes**:
```bash
# Check error statistics
curl http://localhost:3000/errors | jq '.errorRate'
```

### Performance Tuning:

```typescript
// Adjust metrics collection frequency
const METRICS_COLLECTION_INTERVAL = 60000; // 1 minute instead of 30 seconds

// Limit histogram data retention
const MAX_HISTOGRAM_VALUES = 500; // Reduce from 1000

// Exclude noisy endpoints
const EXCLUDED_PATHS = ['/health', '/metrics', '/favicon.ico'];
```

## 📝 Best Practices

### Logging:
- Use structured logging with consistent field names
- Include correlation IDs in all logs
- Log business events with audit() method
- Sanitize sensitive data before logging
- Use appropriate log levels (debug for development, info for production)

### Metrics:
- Use tags for dimensional analysis
- Keep tag cardinality reasonable (< 100 unique values)
- Time critical operations
- Monitor business metrics, not just technical ones

### Error Tracking:
- Classify errors by business impact
- Set up alerts for critical errors
- Track error trends, not just counts
- Include context for debugging

---

**Created**: 2025-07-11  
**Version**: 1.0.0  
**Maintainer**: Renovation Helper Backend Team