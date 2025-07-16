import { defineStore, StoreDefinition } from 'pinia';
import {
  CALCULATION_STORE_NAME,
  CalculationStoreActions,
  CalculationStoreGetters,
  CalculationStoreState,
} from '@app/stores/calculation/types';
import { calculationStoreState } from '@app/stores/calculation/state';
import { calculationStoreGetters } from '@app/stores/calculation/getters';
import { calculationStoreActions } from '@app/stores/calculation/actions';

export const useCalculationStore: StoreDefinition<
  typeof CALCULATION_STORE_NAME,
  CalculationStoreState,
  CalculationStoreGetters,
  CalculationStoreActions
> = defineStore(CALCULATION_STORE_NAME, {
  state: calculationStoreState,
  getters: calculationStoreGetters,
  actions: calculationStoreActions,
  persist: true,
});
