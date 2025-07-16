import { FastifyInstance } from 'fastify';
import { ServiceNames } from '@common';
import { ReportController } from '../controllers/report/report.controller.ts';

export const report = async (fastify: FastifyInstance): Promise<void> => {
  const reportController = fastify.diContainer.resolve<ReportController>(ServiceNames.BAReportController);

  fastify.post(
    '/report',
    {
      preHandler: [fastify.authenticate],
    },
    reportController.getReport.bind(reportController)
  );
};
