import { injectable } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

@injectable()
export class MeController {
  public async me(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(request.user);
  }
}
