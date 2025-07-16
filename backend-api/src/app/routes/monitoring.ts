import { FastifyInstance } from 'fastify';
import { metrics } from '../utils/metrics';
import { errorTracker } from '../utils/errorTracking';
import { logger } from '../utils/logger';

export async function monitoring(fastify: FastifyInstance): Promise<void> {
  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    return reply.status(200).send(health);
  });

  // Metrics endpoint
  fastify.get('/metrics', async (request, reply) => {
    const summary = metrics.getMetricsSummary();
    
    logger.debug('Metrics requested', {
      component: 'monitoring',
      operation: 'get-metrics',
    });

    return reply.status(200).send(summary);
  });

  // Error statistics endpoint
  fastify.get('/errors', async (request, reply) => {
    const errorStats = errorTracker.getErrorStats();
    
    logger.debug('Error stats requested', {
      component: 'monitoring',
      operation: 'get-errors',
    });

    return reply.status(200).send(errorStats);
  });

  // System info endpoint
  fastify.get('/system', async (request, reply) => {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    const systemInfo = {
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        heapUsedPercentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: process.uptime(),
      pid: process.pid,
    };

    return reply.status(200).send(systemInfo);
  });

  // Log level endpoint (for runtime log level changes)
  fastify.post('/log-level', {
    schema: {
      body: {
        type: 'object',
        properties: {
          level: { 
            type: 'string',
            enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
          }
        },
        required: ['level']
      }
    }
  }, async (request, reply) => {
    const { level } = request.body as { level: string };
    
    // Note: This would require updating the logger to support dynamic level changes
    logger.info('Log level change requested', {
      component: 'monitoring',
      operation: 'change-log-level',
      newLevel: level,
      audit: true,
    });

    return reply.status(200).send({ 
      message: 'Log level change requested',
      level 
    });
  });
}