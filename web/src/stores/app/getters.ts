import { AppStoreGetters, AppStoreState, AppStoreStateError, AppStoreStateStatus } from '@app/stores/app/types';

export const appStoreGetters: AppStoreGetters = {
  appError(state: AppStoreState): AppStoreStateError | null {
    return state.error;
  },

  appStatus(state: AppStoreState): AppStoreStateStatus {
    return state.status;
  },
};
