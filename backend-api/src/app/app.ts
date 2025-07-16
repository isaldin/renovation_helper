import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';

import { initializeContainer } from './container';
import * as plugins from './plugins';
import * as routes from './routes';
import * as decorators from './decorators';
import loggingPlugin from './plugins/logging.plugin';

export type AppOptions = {
  //
};

export async function app(fastify: FastifyInstance, _opts: AppOptions) {
  initializeContainer();

  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  fastify.register(fastifyCookie);

  // Register logging plugin first
  await fastify.register(loggingPlugin, {
    excludePaths: ['/health', '/metrics'],
    logRequestBody: process.env.NODE_ENV === 'development',
    logResponseBody: false,
  });

  fastify.register(decorators.diContainerDecorator);
  fastify.register(decorators.authGuardDecorator);

  fastify.register(plugins.sensible);

  fastify.register(routes.auth);
  fastify.register(routes.home);
  fastify.register(routes.me);
  fastify.register(routes.calculationResults);
  fastify.register(routes.report);
  
  // Register monitoring routes (commented out for now)
  // const { monitoring } = await import('./routes/monitoring');
  // fastify.register(monitoring);
}
