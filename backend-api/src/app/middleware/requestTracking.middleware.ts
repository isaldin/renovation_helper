import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export interface RequestContext {
  correlationId: string;
  userId?: string;
  userAgent?: string;
  ip: string;
  method: string;
  url: string;
  startTime: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    context: RequestContext;
  }
}

export async function requestTrackingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const correlationId = 
    (request.headers['x-correlation-id'] as string) || 
    uuidv4();

  const context: RequestContext = {
    correlationId,
    userId: request.user?.userId,
    userAgent: request.headers['user-agent'],
    ip: request.ip,
    method: request.method,
    url: request.url,
    startTime: Date.now(),
  };

  // Attach context to request
  request.context = context;

  // Add correlation ID to response headers
  reply.header('x-correlation-id', correlationId);

  // Log incoming request
  logger.info('Incoming request', {
    correlationId,
    method: request.method,
    url: request.url,
    userAgent: context.userAgent,
    ip: context.ip,
    userId: context.userId,
  });

  // Hook to log response
  reply.hijack();
  const originalSend = reply.send.bind(reply);

  reply.send = function(payload: any) {
    const duration = Date.now() - context.startTime;
    
    logger.info('Request completed', {
      correlationId,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      userId: context.userId,
      responseSize: typeof payload === 'string' ? payload.length : JSON.stringify(payload).length,
    });

    return originalSend(payload);
  };
}