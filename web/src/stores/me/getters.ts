import { MeStoreGetters, MeStoreState, MeUser } from '@app/stores/me/types';

export const meStoreGetters: MeStoreGetters = {
  meUser(state: MeStoreState): MeUser | null {
    return state.user;
  },
};
