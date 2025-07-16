import { injectable, inject } from 'tsyringe';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FirebaseStore } from './firebaseStore';
import { ServiceNames } from '../../di';
import { FirebaseServiceAccountJsonProvider } from '../../services';

@injectable()
export class AdminFirebaseStore implements FirebaseStore {
  private readonly store: ReturnType<typeof getFirestore>;

  constructor(
    @inject(ServiceNames.FirebaseServiceAccountJsonProvider)
    firebaseServiceAccountJsonProvider: FirebaseServiceAccountJsonProvider
  ) {
    initializeApp({
      credential: cert(firebaseServiceAccountJsonProvider.getServiceAccountJson()),
    });

    this.store = getFirestore();
  }

  public async createDoc<T extends Record<string, unknown>>(collectionName: string, data: T): Promise<string> {
    const docRef = await this.store.collection(collectionName).add(data);
    return docRef.id;
  }

  public delete(collectionName: string, id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async getDocById<T>(collectionName: string, id: string): Promise<T | null> {
    const doc = await this.store.collection(collectionName).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as T;
  }

  public async getDocs<T>(collectionName: string): Promise<T[]> {
    const snapshot = await this.store.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  }

  public async getWhere<T>(collectionName: string, conds: Record<string, unknown>): Promise<T[]> {
    const colRef = this.store.collection(collectionName);
    const [firstCondition, ...restConditions] = Object.entries(conds);
    const query = colRef.where(firstCondition[0], '==', firstCondition[1]);

    while (restConditions.length > 0) {
      const [field, value] = restConditions.shift()!;
      query.where(field, '==', value);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  }

  public async updateDoc<T extends Record<string, unknown>>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    await this.store.collection(collectionName).doc(id).update(data);
  }
}
