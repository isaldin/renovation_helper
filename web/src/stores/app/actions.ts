import { AppStore, AppStoreActions } from '@app/stores/app/types';

export const appStoreActions: AppStoreActions = {
  setError(this: AppStore, error) {
    this.error = error;
  },

  setStatus(this: AppStore, status) {
    this.status = status;
  },
};
