import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { isValid as isValidFn, parse as parseFn } from '@telegram-apps/init-data-node';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';

type TelegramAuthRequest = FastifyRequest<{
  Body: {
    initData: string;
  };
}>;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

console.log('BOT_TOKEN:', BOT_TOKEN);

const INVALID_AUTH_ERROR_STRING = 'Invalid auth data. Please try again.';
const NO_ACCESS_TOKEN_ERROR_STRING = 'No access token provided. Please log in again.';

export const auth = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post('/auth/verify', async (request: TelegramAuthRequest, reply: FastifyReply) => {
    const { initData } = request.body;

    console.log('Received initData:', initData);

    if (typeof initData !== 'string') {
      return reply.status(401).send({ error: INVALID_AUTH_ERROR_STRING });
    }

    const isValid = isValidFn(initData, BOT_TOKEN);

    if (!isValid) {
      console.log('Invalid initData:', initData);
      return reply.status(401).send({ error: INVALID_AUTH_ERROR_STRING });
    }

    const parsedData = parseFn(initData);

    if (!parsedData.user?.id) {
      return reply.status(401).send({ error: INVALID_AUTH_ERROR_STRING });
    }

    const userId = parsedData.user.id;
    const authDate = parsedData.auth_date;

    const token = jwtSign({ sub: userId, auth_date: authDate }, JWT_SECRET, { expiresIn: '1d' });

    reply
      .setCookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24,
        domain: process.env.AUTH_COOKIE_DOMAIN!,
      })
      .send(200);
  });

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
