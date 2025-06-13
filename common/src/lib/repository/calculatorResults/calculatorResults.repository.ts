import { FirestoreRepository } from '../firestoreRepository';
import { CalculatorResults } from '../../types/calculatorResults';
import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { FirebaseService } from '../../services';

@injectable()
export class CalculatorResultsRepository extends FirestoreRepository<CalculatorResults> {
  constructor(@inject(ServiceNames.FirebaseService) protected override readonly firebaseService: FirebaseService) {
    super(firebaseService, 'calculatorResults');
  }
}
