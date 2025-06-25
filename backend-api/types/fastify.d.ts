import 'fastify';
import { DependencyContainer } from 'tsyringe';

declare module 'fastify' {
  interface FastifyInstance {
    diContainer: DependencyContainer;
    authenticate: any;
  }

  interface FastifyRequest {
    user?: JwtUserData;
  }
}
