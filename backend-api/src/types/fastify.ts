import { FastifyInstance } from 'fastify';
import { DependencyContainer } from 'tsyringe';

export type AppFastifyInstance = FastifyInstance & {
  diContainer: DependencyContainer;
  authenticate: any;
};
