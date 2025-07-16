import { AppStoreState } from '@app/stores/app/types';

export const appStoreState = (): AppStoreState => ({
  error: null,
  status: 'loading',
});
