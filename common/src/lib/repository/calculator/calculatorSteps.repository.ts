import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { FirebaseService } from '../../services';
import { Step } from '../../types';

@injectable()
export class CalculatorStepsRepository {
  constructor(@inject(ServiceNames.FirebaseService) private readonly firebaseService: FirebaseService) {}

  async getAll(companyId: string, calculatorId: string): Promise<Step[]> {
    const col = collection(this.firebaseService.getStore(), `companies/${companyId}/calculator/${calculatorId}/steps`);
    const snap = await getDocs(col);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Step));
  }

  async saveAll(companyId: string, version: string, steps: Step[]): Promise<void> {
    const store = this.firebaseService.getStore();
    const basePath = `companies/${companyId}/calculator/${version}/steps`;
    await Promise.all(steps.map((step) => setDoc(doc(store, basePath, step.id), step)));
  }
}
