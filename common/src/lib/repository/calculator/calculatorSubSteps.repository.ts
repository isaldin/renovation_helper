import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { FirebaseService } from '../../services';
import { FirestoreRepository } from '../firestoreRepository';
import { SubStep } from '../../types';
import { collection, getDocs } from 'firebase/firestore';

@injectable()
export class CalculatorSubStepsRepository extends FirestoreRepository<SubStep> {
  constructor(@inject(ServiceNames.FirebaseService) protected override readonly firebaseService: FirebaseService) {
    super(firebaseService, 'substeps');
  }

  async getAllForCompanyAndCalculator(companyId: string, calculatorId: string): Promise<SubStep[]> {
    const col = collection(
      this.firebaseService.getStore(),
      `companies/${companyId}/calculator/${calculatorId}/substeps`
    );
    const snap = await getDocs(col);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SubStep));
  }
}
