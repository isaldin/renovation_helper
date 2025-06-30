import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { ServiceNames } from '@common';
import { BaseAuthController } from '../controllers/auth/auth.controller.base.ts';

export const auth = async (fastify: FastifyInstance): Promise<void> => {
  const authController = container.resolve<BaseAuthController>(ServiceNames.BAAuthController);

  fastify.post('/auth/verify', authController.verify.bind(authController));
};
