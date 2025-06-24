import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '@common';
import { DomainCalculatorMapRepository } from '../repositories/domainCalculatorMap.repository';

@injectable()
export class DomainCalculatorMapService {
  constructor(
    @inject(ServiceNames.BADomainCalculatorMapRepository)
    private readonly domainCalculatorMapRepository: DomainCalculatorMapRepository
  ) {}

  public async getForDomain(domain: string) {
    return this.domainCalculatorMapRepository.getForDomain(domain);
  }
}
