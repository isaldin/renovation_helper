import { inject, injectable } from 'tsyringe';
import { FirestoreRepository } from '../firebase/firestoreRepository';
import { CalculatorSettings } from '../../types';
import { ServiceNames } from '../../di';
import { FirebaseStore } from '../firebase/firebaseStore';

@injectable()
export class CalculatorSettingsRepository extends FirestoreRepository<CalculatorSettings> {
  constructor(@inject(ServiceNames.FirebaseStore) protected override readonly firebaseStore: FirebaseStore) {
    super(firebaseStore, 'settings');
  }

  public async getAllForCalculator(calculatorId: string): Promise<CalculatorSettings | null> {
    const settings = await this.getAll(`calculator/${calculatorId}/settings`);
    return settings.length > 0 ? settings[0] : null;
  }
}
