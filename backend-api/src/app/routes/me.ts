import { MeController } from '../controllers/me.controller.ts';
import { ServiceNames } from '@common';
import { FastifyInstance } from 'fastify';

export const me = async (fastify: FastifyInstance): Promise<void> => {
  const meController = fastify.diContainer.resolve<MeController>(ServiceNames.BAMeController);

  fastify.get('/me', { preHandler: [fastify.authenticate] }, meController.me.bind(meController));
};
