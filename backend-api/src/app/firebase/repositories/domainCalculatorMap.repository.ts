import { inject, injectable } from 'tsyringe';
import { FirestoreRepository } from '@common/repository/firebase/firestoreRepository';
import { DomainCalculatorMap } from '../entities/domainCalculatorMap';
import { ServiceNames } from '@common';
import { FirebaseStore } from '@common/repository/firebase/firebaseStore';

@injectable()
export class DomainCalculatorMapRepository extends FirestoreRepository<DomainCalculatorMap> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'domainCalculatorMap');
  }

  public async getForDomain(domain: string): Promise<DomainCalculatorMap | null> {
    const results = await this.getWhere({ domain });
    return results[0] || null;
  }
}
