import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { DomainCalculatorMapRepository } from '../../repository/domainCalculatorMap/domainCalculatorMap.repository';

@injectable()
export class DomainCalculatorMapService {
  constructor(
    @inject(ServiceNames.DomainCalculatorMapRepository)
    private readonly domainCalculatorMapRepository: DomainCalculatorMapRepository
  ) {}

  public async getForDomain(domain: string) {
    return this.domainCalculatorMapRepository.getForDomain(domain);
  }
}
