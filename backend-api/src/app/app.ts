import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';

import { initializeContainer } from './container';
import * as plugins from './plugins';
import * as routes from './routes';

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

  fastify.register(plugins.sensible);

  fastify.register(routes.auth);
  fastify.register(routes.home);
  fastify.register(routes.me);
}
