import { FastifyRequest } from 'fastify';

export type TelegramAuthRequest = FastifyRequest<{
  Body: {
    initData: string;
  };
}>;
