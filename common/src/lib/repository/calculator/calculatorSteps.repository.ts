import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { Step } from '../../types';
import { FirestoreRepository } from '../firebase/firestoreRepository';
import { FirebaseStore } from '../firebase/firebaseStore';

@injectable()
export class CalculatorStepsRepository extends FirestoreRepository<Step> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'steps');
  }

  public async getAllForCalculator(calculatorId: string): Promise<Step[]> {
    return this.getAll(`calculator/${calculatorId}/steps`);
  }
}
