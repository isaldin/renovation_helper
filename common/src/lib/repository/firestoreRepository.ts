import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '../di';
import { FirebaseService } from '../services';
import { MakeOptional } from '../types';

@injectable()
export class FirestoreRepository<T extends { id?: string }> implements BaseRepository<T> {
  private readonly collectionRef: CollectionReference<DocumentData>;

  constructor(
    @inject(ServiceNames.FirebaseService) protected readonly firebaseService: FirebaseService,
    private readonly collectionName: string
  ) {
    this.collectionRef = collection(this.firebaseService.getStore(), this.collectionName);
  }

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  }

  async getById(id: string): Promise<T | null> {
    const document = await getDoc(doc(this.collectionRef, id));
    return document.exists() ? ({ id: document.id, ...document.data() } as T) : null;
  }

  async create(data: MakeOptional<T, 'id'>): Promise<string> {
    const docRef = await addDoc(this.collectionRef, data);
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await updateDoc(doc(this.collectionRef, id), data as DocumentData);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef, id));
  }
}
