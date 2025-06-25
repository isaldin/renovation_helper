import { container } from 'tsyringe';
import { MeController } from '../controllers/me.controller.ts';
import { ServiceNames } from '@common';
import { FastifyInstance } from 'fastify';

export const me = async (fastify: FastifyInstance): Promise<void> => {
  const meController = container.resolve<MeController>(ServiceNames.BAMeController);

  fastify.get('/me', { preHandler: [fastify.authenticate] }, meController.me.bind(meController));
};
