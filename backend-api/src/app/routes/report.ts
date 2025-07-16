import { FastifyInstance } from 'fastify';
// import { ReportController } from '../controllers/report/report.controller.ts';
import { ServiceNames } from '@common';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ReportController } from '../controllers/report/report.controller.ts';

export const report = async (fastify: FastifyInstance): Promise<void> => {
  const reportController = fastify.diContainer.resolve<ReportController>(ServiceNames.BAReportController);

  fastify.post(
    '/report',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: zodToJsonSchema(reportController.reportRequestSchema),
      },
    },
    reportController.getReport.bind(reportController)
  );
};
