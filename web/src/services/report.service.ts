import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '@/common';
import { HttpService } from '@app/services/http.service';

@injectable()
export class ReportService {
  constructor(@inject(ServiceNames.WAHttpService) private readonly httpService: HttpService) {}

  public getReport() {
    return this.httpService.post('/report');
  }
}
