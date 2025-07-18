import { inject, injectable } from 'tsyringe';
import { FirestoreRepository } from '../firebase/firestoreRepository';
import { DomainCalculatorMap } from '../../types/domainCalculatorMap';
import { FirebaseStore } from '../firebase/firebaseStore';
import { ServiceNames } from '../../di';

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
