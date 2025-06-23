export interface FirebaseStore {
  getDocs<T>(collectionName: string): Promise<T[]>;
  getDocById<T>(collectionName: string, id: string): Promise<T | null>;
  getWhere<T>(collectionName: string, conds: Record<string, unknown>): Promise<T[]>;
  createDoc<T extends Record<string, unknown>>(collectionName: string, data: T): Promise<string>;
  updateDoc<T extends Record<string, unknown>>(collectionName: string, id: string, data: Partial<T>): Promise<void>;
  delete(collectionName: string, id: string): Promise<void>;
}
