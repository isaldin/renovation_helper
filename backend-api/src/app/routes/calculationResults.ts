import { FastifyInstance } from 'fastify';
import { CalculationResultsController } from '../controllers/calculationResults.controller.ts';
import { ServiceNames } from '@common';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const calculationResults = async (fastify: FastifyInstance) => {
  const controller = fastify.diContainer.resolve<CalculationResultsController>(
    ServiceNames.BACalculationResultsController
  );

  fastify.post(
    '/calculation-results',
    {
      preHandler: fastify.authenticate,
      schema: {
        body: zodToJsonSchema(controller.saveResultsSchema),
      },
    },
    controller.saveResults.bind(controller)
  );
};
