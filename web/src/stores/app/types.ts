import { Store } from 'pinia';

export const APP_STORE_NAME = 'appStore';

export type AppStoreStateError = 'unauthorized' | 'domain-not-allowed';
export type AppStoreStateStatus = 'ready' | 'error' | 'loading';

export type AppStoreState = {
  error: AppStoreStateError | null;
  status: AppStoreStateStatus;
};

export type AppStoreActions = {
  setError(error: AppStoreStateError | null): void;
  setStatus(status: AppStoreStateStatus): void;
};

export type AppStoreGetters = {
  appError(state: AppStoreState): AppStoreStateError | null;
  appStatus(state: AppStoreState): AppStoreStateStatus;
};

export type AppStore = Store<typeof APP_STORE_NAME, AppStoreState, AppStoreGetters, AppStoreActions>;
