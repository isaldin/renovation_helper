import { fastifyPlugin } from 'fastify-plugin';
import { container } from 'tsyringe';

export const diContainerDecorator = fastifyPlugin(
  async (fastify) => {
    fastify.decorate('diContainer', container);
  },
  { name: 'diContainer' }
);
