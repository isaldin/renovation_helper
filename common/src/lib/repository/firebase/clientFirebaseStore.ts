import {
  Firestore,
  collection,
  getFirestore,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  DocumentData,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { FirebaseStore } from './firebaseStore';
import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '../../di';
import { FirebaseServiceConfig } from '../../services';
import { FirebaseApp, initializeApp } from 'firebase/app';

@injectable()
export class ClientFirebaseStore implements FirebaseStore {
  private readonly firebaseApp: FirebaseApp;
  private readonly store: Firestore;

  constructor(@inject(ServiceNames.FirebaseClientConfigService) firebaseClientConfig: FirebaseServiceConfig) {
    this.firebaseApp = initializeApp(firebaseClientConfig);
    this.store = getFirestore(this.firebaseApp);
  }

  public async getDocs<T>(collectionName: string): Promise<T[]> {
    const snapshot = await getDocs(collection(this.store, collectionName));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  }

  public async getDocById<T>(collectionName: string, id: string): Promise<T | null> {
    const document = await getDoc(doc(collection(this.store, collectionName), id));
    return document.exists() ? ({ id: document.id, ...document.data() } as T) : null;
  }

  public async getWhere<T>(collectionName: string, conds: Record<string, unknown>): Promise<T[]> {
    const col = collection(this.store, collectionName);
    const q = query(col, ...Object.entries(conds).map(([field, value]) => where(field, '==', value)));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  }

  public async createDoc<T extends Record<string, unknown>>(collectionName: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(this.store, collectionName), data);
    return docRef.id;
  }

  public async updateDoc<T extends Record<string, unknown>>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(collection(this.store, collectionName), id);
    await updateDoc(docRef, data as DocumentData);
  }

  public delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(collection(this.store, collectionName), id);
    return deleteDoc(docRef);
  }
}
