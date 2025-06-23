import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { FirestoreRepository } from '../firebase/firestoreRepository';
import { SubStep } from '../../types';
import { FirebaseStore } from '../firebase/firebaseStore';

@injectable()
export class CalculatorSubStepsRepository extends FirestoreRepository<SubStep> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'substeps');
  }

  public async getAllForCalculator(calculatorId: string): Promise<SubStep[]> {
    return this.getAll(`calculator/${calculatorId}/substeps`);
  }
}
