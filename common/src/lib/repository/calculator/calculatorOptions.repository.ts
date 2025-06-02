import { inject, injectable } from 'tsyringe';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { ServiceNames } from '../../di';
import { FirebaseService } from '../../services';
import { OptionList } from '../../types';

@injectable()
export class CalculatorOptionsRepository {
  constructor(@inject(ServiceNames.FirebaseService) private readonly firebaseService: FirebaseService) {}

  async getAll(companyId: string, calculatorId: string): Promise<OptionList[]> {
    const col = collection(
      this.firebaseService.getStore(),
      `companies/${companyId}/calculator/${calculatorId}/options`
    );
    const snap = await getDocs(col);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as OptionList));
  }

  async saveAll(companyId: string, version: string, optionLists: OptionList[]): Promise<void> {
    const store = this.firebaseService.getStore();
    const basePath = `companies/${companyId}/calculator/${version}/options`;
    await Promise.all(optionLists.map((list) => setDoc(doc(store, basePath, list.id), list)));
  }
}
