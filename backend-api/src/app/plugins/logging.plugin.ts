import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

interface LoggingPluginOptions {
  excludePaths?: string[];
  logRequestBody?: boolean;
  logResponseBody?: boolean;
  maxBodySize?: number;
}

const defaultOptions: LoggingPluginOptions = {
  excludePaths: ['/health', '/metrics'],
  logRequestBody: true,
  logResponseBody: false,
  maxBodySize: 1024, // 1KB
};

async function loggingPlugin(
  fastify: FastifyInstance,
  options: LoggingPluginOptions = {}
) {
  const config = { ...defaultOptions, ...options };

  // Add request tracking hook
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip logging for excluded paths
    if (config.excludePaths?.some(path => request.url.includes(path))) {
      return;
    }

    const correlationId = 
      (request.headers['x-correlation-id'] as string) || 
      uuidv4();

    const context = {
      correlationId,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      startTime: Date.now(),
    };

    // Set correlation ID in response header
    reply.header('x-correlation-id', correlationId);

    // Set logging context
    logger.setContext({
      correlationId,
      component: 'api',
    });

    // Store context in request for later use
    (request as any).logContext = context;

    logger.info('Request started', {
      method: request.method,
      url: request.url,
      userAgent: context.userAgent,
      ip: context.ip,
      headers: sanitizeHeaders(request.headers),
    });
  });

  // Add authentication context after auth
  fastify.addHook('preHandler', async (request: FastifyRequest) => {
    if ((request as any).user) {
      logger.setContext({
        userId: (request as any).user.userId,
        companyId: (request as any).user.companyId,
        calculatorId: (request as any).user.calculatorId,
      });
    }
  });

  // Log request body if enabled
  fastify.addHook('preHandler', async (request: FastifyRequest) => {
    const context = (request as any).logContext;
    if (!context || !config.logRequestBody) return;

    if (request.body && shouldLogBody(request.body, config.maxBodySize!)) {
      logger.debug('Request body', {
        body: sanitizeBody(request.body),
      });
    }
  });

  // Log response
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload) => {
    const context = (request as any).logContext;
    if (!context) return payload;

    const duration = Date.now() - context.startTime;
    const responseSize = getPayloadSize(payload);

    logger.info('Request completed', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      responseSize,
    });

    // Log response body if enabled and status indicates error
    if (config.logResponseBody && reply.statusCode >= 400) {
      if (shouldLogBody(payload, config.maxBodySize!)) {
        logger.debug('Response body', {
          statusCode: reply.statusCode,
          body: sanitizeBody(payload),
        });
      }
    }

    return payload;
  });

  // Log errors
  fastify.addHook('onError', async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
    const context = (request as any).logContext;
    const duration = context ? Date.now() - context.startTime : 0;

    logger.errorWithStack(error, 'Request failed', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
    });
  });
}

// Helper functions
function sanitizeHeaders(headers: any): any {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  const sanitized = { ...headers };
  
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

function sanitizeBody(body: any): any {
  if (typeof body !== 'object') return body;
  
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  const sanitized = JSON.parse(JSON.stringify(body));
  
  function recursiveSanitize(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    for (const key in obj) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        recursiveSanitize(obj[key]);
      }
    }
    
    return obj;
  }
  
  return recursiveSanitize(sanitized);
}

function shouldLogBody(body: any, maxSize: number): boolean {
  if (!body) return false;
  
  const size = getPayloadSize(body);
  return size <= maxSize;
}

function getPayloadSize(payload: any): number {
  if (!payload) return 0;
  
  if (typeof payload === 'string') return payload.length;
  if (Buffer.isBuffer(payload)) return payload.length;
  
  try {
    return JSON.stringify(payload).length;
  } catch {
    return 0;
  }
}

export default fastifyPlugin(loggingPlugin, {
  name: 'logging-plugin',
  fastify: '5.x'
});