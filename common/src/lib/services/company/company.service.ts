import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { Company } from '../../types';
import { CompanyRepository } from '../../repository/company/company.repository';

@injectable()
export class CompanyService {
  constructor(
    @inject(ServiceNames.CompanyRepository)
    private readonly companyRepository: CompanyRepository
  ) {}

  async getCompany(id: string): Promise<Company | null> {
    return this.companyRepository.getById(id);
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.getAll();
  }
}
