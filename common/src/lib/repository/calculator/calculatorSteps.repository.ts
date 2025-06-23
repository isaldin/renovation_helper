import { collection, getDocs } from 'firebase/firestore';
import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { FirebaseService } from '../../services';
import { Step } from '../../types';
import { FirestoreRepository } from '../firestoreRepository';

@injectable()
export class CalculatorStepsRepository extends FirestoreRepository<Step> {
  constructor(@inject(ServiceNames.FirebaseService) protected override readonly firebaseService: FirebaseService) {
    super(firebaseService, 'steps');
  }

  async getAllForCalculator(calculatorId: string): Promise<Step[]> {
    const col = collection(this.firebaseService.getStore(), `calculator/${calculatorId}/steps`);
    const snap = await getDocs(col);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Step));
  }
}
