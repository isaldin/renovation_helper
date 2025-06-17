import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const home = async (fastify: FastifyInstance) => {
  fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({ message: 'Hello World!' });
  });
};
