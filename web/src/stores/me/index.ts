import { defineStore, StoreDefinition } from 'pinia';
import { ME_STORE_NAME, MeStoreActions, MeStoreGetters, MeStoreState } from '@app/stores/me/types';
import { meStoreState } from '@app/stores/me/state';
import { meStoreGetters } from '@app/stores/me/getters';
import { meStoreActions } from '@app/stores/me/actions';

export const useMeStore: StoreDefinition<typeof ME_STORE_NAME, MeStoreState, MeStoreGetters, MeStoreActions> =
  defineStore(ME_STORE_NAME, {
    state: meStoreState,
    getters: meStoreGetters,
    actions: meStoreActions,
  });
