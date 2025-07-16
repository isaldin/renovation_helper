import { logger } from './logger';
import { metrics } from './metrics';

export interface ErrorContext {
  correlationId?: string;
  userId?: string;
  operation?: string;
  component?: string;
  additional?: Record<string, any>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  stackTrace: string;
}

class ErrorTracker {
  private errorReports: ErrorReport[] = [];
  private errorCounts: Map<string, number> = new Map();
  
  constructor() {
    // Periodically clean up old error reports
    setInterval(() => {
      this.cleanupOldErrors();
    }, 300000); // Every 5 minutes
  }

  track(
    error: Error, 
    context: ErrorContext = {}, 
    severity: ErrorReport['severity'] = 'medium'
  ): void {
    const errorReport: ErrorReport = {
      error,
      context,
      severity,
      timestamp: Date.now(),
      stackTrace: error.stack || '',
    };

    this.errorReports.push(errorReport);
    
    // Count errors by type
    const errorKey = `${error.name}:${error.message}`;
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

    // Log the error
    logger.errorWithStack(error, `Error tracked [${severity}]`, {
      ...context,
      severity,
      errorType: error.name,
    });

    // Record metrics
    metrics.increment('errors_total', 1, {
      severity,
      errorType: error.name,
      component: context.component || 'unknown',
    });

    // Alert for critical errors
    if (severity === 'critical') {
      this.sendAlert(errorReport);
    }

    // Check for error rate spikes
    this.checkErrorRateSpike(errorKey);
  }

  // Track business logic errors
  trackBusinessError(
    operation: string,
    message: string,
    context: ErrorContext = {}
  ): void {
    const error = new Error(message);
    error.name = 'BusinessLogicError';
    
    this.track(error, { ...context, operation }, 'medium');
  }

  // Track validation errors
  trackValidationError(
    field: string,
    value: any,
    message: string,
    context: ErrorContext = {}
  ): void {
    const error = new Error(`Validation failed for ${field}: ${message}`);
    error.name = 'ValidationError';
    
    this.track(error, { 
      ...context, 
      operation: 'validation',
      additional: { field, value: typeof value === 'object' ? '[object]' : value }
    }, 'low');
  }

  // Track database errors
  trackDbError(
    operation: string,
    collection: string,
    error: Error,
    context: ErrorContext = {}
  ): void {
    this.track(error, {
      ...context,
      operation: `db.${operation}`,
      component: 'database',
      additional: { collection }
    }, 'high');
  }

  // Track external API errors
  trackApiError(
    apiName: string,
    endpoint: string,
    error: Error,
    context: ErrorContext = {}
  ): void {
    this.track(error, {
      ...context,
      operation: `api.${apiName}`,
      component: 'external-api',
      additional: { endpoint }
    }, 'medium');
  }

  // Get error statistics
  getErrorStats(): any {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const lastHour = now - (60 * 60 * 1000);

    const recent24h = this.errorReports.filter(e => e.timestamp > last24h);
    const recentHour = this.errorReports.filter(e => e.timestamp > lastHour);

    const severityStats = recent24h.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const componentStats = recent24h.reduce((acc, report) => {
      const component = report.context.component || 'unknown';
      acc[component] = (acc[component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errorReports.length,
      last24h: recent24h.length,
      lastHour: recentHour.length,
      bySeverity: severityStats,
      byComponent: componentStats,
      topErrors: this.getTopErrors(10),
      errorRate: {
        last24h: recent24h.length / 24, // errors per hour
        lastHour: recentHour.length,
      }
    };
  }

  // Get most frequent errors
  getTopErrors(limit: number = 10): Array<{ error: string; count: number }> {
    return Array.from(this.errorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([error, count]) => ({ error, count }));
  }

  private sendAlert(errorReport: ErrorReport): void {
    logger.fatal('CRITICAL ERROR ALERT', {
      error: errorReport.error.message,
      context: errorReport.context,
      stackTrace: errorReport.stackTrace,
      alert: true,
    });

    // Here you could integrate with alerting services:
    // - Slack webhook
    // - PagerDuty
    // - Email notifications
    // - Discord webhook
    // etc.
  }

  private checkErrorRateSpike(errorKey: string): void {
    const count = this.errorCounts.get(errorKey) || 0;
    
    // Alert if same error occurs more than 5 times in short period
    if (count > 5) {
      logger.warn('Error rate spike detected', {
        errorKey,
        count,
        alert: true,
      });
    }
  }

  private cleanupOldErrors(): void {
    const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
    
    this.errorReports = this.errorReports.filter(
      report => report.timestamp > cutoff
    );

    logger.debug('Error reports cleanup completed', {
      component: 'error-tracker',
      remainingReports: this.errorReports.length,
    });
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Helper decorator for automatic error tracking
export function trackErrors(
  operation: string, 
  component?: string,
  severity: ErrorReport['severity'] = 'medium'
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        errorTracker.track(error as Error, {
          operation,
          component,
        }, severity);
        throw error; // Re-throw to maintain normal error flow
      }
    };

    return descriptor;
  };
}