import { Store } from 'pinia';

export const ME_STORE_NAME = 'meStore';

export type MeUser = {
  userId: string;
  authDate: Date;
  companyId: string;
  calculatorId: string;
  reportId?: string;
};

export type MeStoreState = {
  user: MeUser | null;
};

export type MeStoreActions = {
  setUser(user: MeUser): void;
};

export type MeStoreGetters = {
  meUser(state: MeStoreState): MeUser | null;
};

export type MeStore = Store<typeof ME_STORE_NAME, MeStoreState, MeStoreGetters, MeStoreActions>;
