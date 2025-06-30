import { FastifyReply } from 'fastify';
import { TelegramAuthRequest } from './auth.controller.types.ts';

export interface BaseAuthController {
  verify(request: TelegramAuthRequest, reply: FastifyReply): Promise<void>;
}
