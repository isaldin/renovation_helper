export type FirebaseServiceConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

export interface FirebaseServiceAccountJsonProvider {
  getServiceAccountJson: () => string;
}
