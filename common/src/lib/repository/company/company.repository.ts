import { inject, injectable } from 'tsyringe';
import { Company } from '../../types';
import { FirestoreRepository } from '../firebase/firestoreRepository';
import { ServiceNames } from '../../di';
import { FirebaseStore } from '../firebase/firebaseStore';

@injectable()
export class CompanyRepository extends FirestoreRepository<Company> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'companies');
  }
}
