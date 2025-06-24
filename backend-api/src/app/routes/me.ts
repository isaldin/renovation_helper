import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { MeController } from '../controllers/me.controller.ts';
import { ServiceNames } from '@common';

export const me = async (fastify: FastifyInstance): Promise<void> => {
  const meController = container.resolve<MeController>(ServiceNames.BAMeController);

  fastify.get('/me', meController.me.bind(meController));
};
