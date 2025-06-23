import { BaseRepository } from '../baseRepository';
import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../../di';
import { MakeOptional } from '../../types';
import { FirebaseStore } from './firebaseStore';

@injectable()
export class FirestoreRepository<T extends { id?: string }> implements BaseRepository<T> {
  constructor(
    @inject(ServiceNames.FirebaseStore) protected readonly firebaseStore: FirebaseStore,
    private readonly collectionName: string
  ) {}

  public getAll(collectionName?: string): Promise<T[]> {
    return this.firebaseStore.getDocs(collectionName || this.collectionName);
  }

  public getById(id: string, collectionName?: string): Promise<T | null> {
    return this.firebaseStore.getDocById(collectionName || this.collectionName, id);
  }

  public create(data: MakeOptional<T, 'id'>, collectionName?: string): Promise<string> {
    return this.firebaseStore.createDoc(collectionName || this.collectionName, data);
  }

  public update(id: string, data: Partial<T>, collectionName?: string): Promise<void> {
    return this.firebaseStore.updateDoc(collectionName || this.collectionName, id, data);
  }

  public delete(id: string, collectionName?: string): Promise<void> {
    return this.firebaseStore.delete(collectionName || this.collectionName, id);
  }

  public getWhere(conds: Record<string, unknown>, collectionName?: string): Promise<T[]> {
    return this.firebaseStore.getWhere(collectionName || this.collectionName, conds);
  }
}
