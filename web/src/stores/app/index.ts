import { defineStore, StoreDefinition } from 'pinia';
import { APP_STORE_NAME, AppStoreActions, AppStoreGetters, AppStoreState } from '@app/stores/app/types';
import { appStoreState } from '@app/stores/app/state';
import { appStoreGetters } from '@app/stores/app/getters';
import { appStoreActions } from '@app/stores/app/actions';

export const useAppStore: StoreDefinition<typeof APP_STORE_NAME, AppStoreState, AppStoreGetters, AppStoreActions> =
  defineStore(APP_STORE_NAME, {
    state: appStoreState,
    getters: appStoreGetters,
    actions: appStoreActions,
  });
