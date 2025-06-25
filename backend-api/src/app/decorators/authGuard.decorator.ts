import { fastifyPlugin } from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServiceNames } from '@common';
import { JwtService } from '../services/jwt.service.ts';

const NO_ACCESS_TOKEN_ERROR_STRING = 'No access token provided. Please log in again.';
const INVALID_OR_EXPIRED_TOKEN_STRING = 'Invalid or expired token';

export const authGuardDecorator = fastifyPlugin(
  async (fastify) => {
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.cookies.accessToken;

      if (!token) {
        return reply.status(401).send({ error: NO_ACCESS_TOKEN_ERROR_STRING });
      }

      const jwtService = fastify.diContainer.resolve<JwtService>(ServiceNames.BAJwtService);

      const user = jwtService.parseToken(token);
      if (!user) {
        return reply.status(401).send({ error: INVALID_OR_EXPIRED_TOKEN_STRING });
      }

      request.user = user;
    });
  },
  { dependencies: ['diContainer'] }
);
