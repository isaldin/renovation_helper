import { injectable } from 'tsyringe';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseServiceConfig } from './firebase.types';

@injectable()
export class FirebaseService {
  private firebaseApp: FirebaseApp | null = null;
  private store: Firestore | null = null;

  public initializeFirebase(config: FirebaseServiceConfig) {
    if (!this.firebaseApp) {
      this.firebaseApp = initializeApp(config);
    }

    if (!this.store) {
      this.store = getFirestore(this.firebaseApp!);
    }
  }

  public getStore() {
    if (!this.store) {
      throw new Error('Firebase not initialized');
    }
    return this.store;
  }
}
