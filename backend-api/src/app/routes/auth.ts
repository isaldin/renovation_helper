import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller.ts';
import { ServiceNames } from '@common';

export const auth = async (fastify: FastifyInstance): Promise<void> => {
  const authController = container.resolve<AuthController>(ServiceNames.BAAuthController);

  fastify.post('/auth/verify', authController.verify.bind(authController));
};
