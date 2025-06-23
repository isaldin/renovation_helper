import { inject, injectable } from 'tsyringe';
import { getDocs } from 'firebase/firestore';
import { collectionGroup } from 'firebase/firestore/lite';
import { FirestoreRepository } from '../firestoreRepository';
import { Calculator } from '../../types';
import { ServiceNames } from '../../di';
import { FirebaseService } from '../../services';

@injectable()
export class CalculatorRepository extends FirestoreRepository<Calculator> {
  constructor(@inject(ServiceNames.FirebaseService) protected override readonly firebaseService: FirebaseService) {
    super(firebaseService, 'calculator');
  }

  async getAllVersions(companyId: string): Promise<string[]> {
    const store = this.firebaseService.getStore();
    const calculatorGroup = collectionGroup(store, 'calculator');
    const snapshot = await getDocs(calculatorGroup);

    return snapshot.docs
      .filter((doc) => doc.ref.path.startsWith(`companies/${companyId}/calculator/`))
      .map((doc) => doc.ref.parent!.id!)
      .filter(Boolean);
  }

  async getLatestVersion(companyId: string): Promise<string | null> {
    const versions = await this.getAllVersions(companyId);
    const sorted = versions.sort((a, b) => Number(b) - Number(a)); // по убыванию времени
    return sorted[0] || null;
  }
}
