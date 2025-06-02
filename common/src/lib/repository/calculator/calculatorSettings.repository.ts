import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { inject, injectable } from 'tsyringe';
import { FirestoreRepository } from '../firestoreRepository';
import { CalculatorSettings } from '../../types';
import { ServiceNames } from '../../di';
import { FirebaseService } from '../../services';

@injectable()
export class CalculatorSettingsRepository extends FirestoreRepository<CalculatorSettings> {
  constructor(@inject(ServiceNames.FirebaseService) protected override readonly firebaseService: FirebaseService) {
    super(firebaseService, 'settings');
  }

  public async get(companyId: string, calculatorId: string): Promise<CalculatorSettings | null> {
    const ref = collection(
      this.firebaseService.getStore(),
      `companies/${companyId}/calculator/${calculatorId}/settings`
    );
    const snap = await getDocs(ref);
    return (snap.docs[0].data() as CalculatorSettings) || null;
  }

  public async save(companyId: string, version: string, data: CalculatorSettings): Promise<void> {
    const ref = doc(this.firebaseService.getStore(), `companies/${companyId}/calculator/${version}/settings`);
    await setDoc(ref, data);
  }
}
