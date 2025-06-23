import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { verify as jwtVerify } from 'jsonwebtoken';

const NO_ACCESS_TOKEN_ERROR_STRING = 'No access token provided. Please log in again.';
const JWT_SECRET = process.env.JWT_SECRET!;

export const me = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.accessToken;

    if (!token) {
      return reply.status(401).send({ error: NO_ACCESS_TOKEN_ERROR_STRING });
    }

    try {
      const payload = jwtVerify(token, JWT_SECRET) as unknown as {
        sub: number;
        auth_date: number;
      };

      return reply.send({
        userId: payload.sub,
        authDate: payload.auth_date,
      });
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });
};
