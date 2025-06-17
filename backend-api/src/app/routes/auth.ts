import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as crypto from 'crypto';

type TelegramAuthRequest = FastifyRequest<{
  Body: Record<string, string>;
}>;

const BOT_TOKEN = ''; //process.env.TELEGRAM_BOT_TOKEN!;

function checkTelegramHash(data: Record<string, string>, botToken: string): boolean {
  const { hash, ...rest } = data;
  const sorted = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(sorted).digest('hex');
  return hmac === hash;
}

export const auth = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post('/auth/verify', async (request: TelegramAuthRequest, reply: FastifyReply) => {
    const isValid = checkTelegramHash(request.body, BOT_TOKEN);

    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid hash' });
    }

    return reply.send({ ok: true });
  });
};
