import { FirestoreRepository } from '../firebase/firestoreRepository';
import { CalculatorResults } from '../../types';
import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { FirebaseStore } from '../firebase/firebaseStore';

@injectable()
export class CalculatorResultsRepository extends FirestoreRepository<CalculatorResults> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'calculatorResults');
  }
}
