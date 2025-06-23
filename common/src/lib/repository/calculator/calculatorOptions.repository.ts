import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { OptionList } from '../../types';
import { FirebaseStore } from '../firebase/firebaseStore';
import { FirestoreRepository } from '../firebase/firestoreRepository';

@injectable()
export class CalculatorOptionsRepository extends FirestoreRepository<OptionList> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'options');
  }

  public async getAllForCalculator(calculatorId: string): Promise<OptionList[]> {
    return this.getAll(`calculator/${calculatorId}/options`);
  }
}
