import { getReportService } from '@app/container';

export const useGetReport = () => {
  const getReport = async () => {
    await getReportService().getReport();
  };

  return { getReport };
};
