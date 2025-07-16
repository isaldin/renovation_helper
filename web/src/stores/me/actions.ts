import { MeStore, MeStoreActions } from '@app/stores/me/types';

export const meStoreActions: MeStoreActions = {
  setUser(this: MeStore, user) {
    this.user = user;
  },
};
