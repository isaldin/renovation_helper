import type { FastifyInstance } from 'fastify';
import { initializeContainer } from './container';
import * as plugins from './plugins';
import * as routes from './routes';

export type AppOptions = {
  //
};

export async function app(fastify: FastifyInstance, _opts: AppOptions) {
  initializeContainer();

  fastify.register(plugins.sensible);

  fastify.register(routes.auth);
  fastify.register(routes.home);
}
