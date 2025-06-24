import { ServiceNames } from '@common';
import { inject, injectable } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtService } from '../services/jwt.service.ts';

const NO_ACCESS_TOKEN_ERROR_STRING = 'No access token provided. Please log in again.';
const INVALID_OR_EXPIRED_TOKEN = 'Invalid or expired token';

@injectable()
export class MeController {
  constructor(@inject(ServiceNames.BAJwtService) private readonly jwtService: JwtService) {}

  public async me(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.accessToken;

    if (!token) {
      return reply.status(401).send({ error: NO_ACCESS_TOKEN_ERROR_STRING });
    }

    try {
      const jwtUserData = this.jwtService.parseToken(token);

      return reply.send(jwtUserData);
    } catch (err) {
      return reply.status(401).send({ error: INVALID_OR_EXPIRED_TOKEN });
    }
  }
}
