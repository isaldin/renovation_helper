import { defineStore, StoreDefinition } from 'pinia';
import { CalculationStoreActions, CalculationStoreGetters, CalculationStoreState } from '@app/stores/calculation/types';
import { calculationStoreState } from '@app/stores/calculation/state';
import { calculationStoreGetters } from '@app/stores/calculation/getter';
import { calculationStoreActions } from '@app/stores/calculation/actions';

export const useCalculationStore: StoreDefinition<
  'calculation',
  CalculationStoreState,
  CalculationStoreGetters,
  CalculationStoreActions
> = defineStore('calculation', {
  state: calculationStoreState,
  getters: calculationStoreGetters,
  actions: calculationStoreActions,
  persist: true,
});
