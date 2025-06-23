import { inject, injectable } from 'tsyringe';
import { FirestoreRepository } from '../firebase/firestoreRepository';
import { Calculator } from '../../types';
import { ServiceNames } from '../../di';
import { FirebaseStore } from '../firebase/firebaseStore';

@injectable()
export class CalculatorRepository extends FirestoreRepository<Calculator> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'calculator');
  }
}
