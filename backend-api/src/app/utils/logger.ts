import pino from 'pino';

export interface LogContext {
  correlationId?: string;
  userId?: string;
  operation?: string;
  component?: string;
  [key: string]: any;
}

// Simple context storage (simplified for now)
let currentContext: LogContext = {};

// Base logger configuration
const baseLogger = pino({
  name: 'backend-api',
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
});

// Enhanced logger with context support
class ContextualLogger {
  private getContext(): LogContext {
    return currentContext;
  }

  private mergeContext(obj: any): any {
    const context = this.getContext();
    return { ...context, ...obj };
  }

  info(message: string, obj: any = {}) {
    baseLogger.info(this.mergeContext(obj), message);
  }

  error(message: string, obj: any = {}) {
    baseLogger.error(this.mergeContext(obj), message);
  }

  warn(message: string, obj: any = {}) {
    baseLogger.warn(this.mergeContext(obj), message);
  }

  debug(message: string, obj: any = {}) {
    baseLogger.debug(this.mergeContext(obj), message);
  }

  fatal(message: string, obj: any = {}) {
    baseLogger.fatal(this.mergeContext(obj), message);
  }

  // Create child logger with additional context
  child(context: LogContext) {
    const currentContext = this.getContext();
    const mergedContext = { ...currentContext, ...context };
    
    return {
      info: (message: string, obj: any = {}) => 
        baseLogger.info({ ...mergedContext, ...obj }, message),
      error: (message: string, obj: any = {}) => 
        baseLogger.error({ ...mergedContext, ...obj }, message),
      warn: (message: string, obj: any = {}) => 
        baseLogger.warn({ ...mergedContext, ...obj }, message),
      debug: (message: string, obj: any = {}) => 
        baseLogger.debug({ ...mergedContext, ...obj }, message),
      fatal: (message: string, obj: any = {}) => 
        baseLogger.fatal({ ...mergedContext, ...obj }, message),
    };
  }

  // Set context for current async execution
  setContext(context: LogContext) {
    currentContext = { ...currentContext, ...context };
  }

  // Run function with specific context
  withContext<T>(context: LogContext, fn: () => T): T {
    const prevContext = currentContext;
    currentContext = { ...currentContext, ...context };
    try {
      return fn();
    } finally {
      currentContext = prevContext;
    }
  }

  // Performance timing helper
  time(label: string, context: LogContext = {}) {
    const startTime = Date.now();
    
    return {
      end: (message?: string, additionalContext: any = {}) => {
        const duration = Date.now() - startTime;
        this.info(message || `Operation completed: ${label}`, {
          ...context,
          ...additionalContext,
          operation: label,
          duration,
          performance: true,
        });
        return duration;
      }
    };
  }

  // Error with stack trace
  errorWithStack(error: Error, message?: string, context: any = {}) {
    this.error(message || error.message, {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }

  // Audit logging for important actions
  audit(action: string, context: any = {}) {
    this.info(`AUDIT: ${action}`, {
      ...context,
      audit: true,
      action,
      timestamp: new Date().toISOString(),
    });
  }
}

export const logger = new ContextualLogger();