<template>
  <div v-if="loading" class="flex justify-center align-middle h-screen px-4">
    <n-spin size="large" />
  </div>

  <div v-else-if="notFound" class="flex justify-center align-middle h-screen px-4">
    <n-h2 class="self-align-center"> Калькулятор не найден </n-h2>
  </div>

  <div v-else-if="error" class="flex justify-center align-middle h-screen flex-col px-4">
    <n-h2>Ошибка загрузки калькулятора</n-h2>
    <n-button type="info" @click="loadCalculator"> Попробовать заново </n-button>
  </div>

  <div v-else class="calculation-view flex justify-center align-middle flex-col h-screen min-h-screen p-4">
    <div class="calculation-view__step-info flex justify-center align-middle">
      <calculation-steps-info-view
        :current-step-idx="currentStepOrderNumber"
        :total-steps-count="calculationStore.stepsCount"
      />
    </div>

    <div class="calculation-view__component flex flex-1 flex-wrap justify-center">
      <div class="calculation-view__component__wrapper">
        <calculation-step-view :step="currentSubStep || currentStep!" />
      </div>
    </div>

    <calculation-steps-nav
      class="calculation-view__navigation"
      :current-step-idx="currentStepOrderNumber"
      :total-steps-count="calculationStore.stepsCount"
      :disabled="!currentAnswer"
      @next="handleGoToNextStep"
      @prev="handleGoToPrevStep"
    />
  </div>
</template>

<script lang="ts" setup>
import { getRouterService } from '@app/container';
import { RouteNames } from '@app/router/routeNames';
import { computed } from 'vue';
import { EntityNotFoundError } from '@/common/errors';
import { useCalculationStore } from '@app/stores/calculation';
import CalculationStepView from '@app/views/calculation/CalculationStepView.vue';
import { NSpin, NButton, NH2 } from 'naive-ui';
import CalculationStepsInfoView from '@app/views/calculation/CalculationStepsInfoView.vue';
import CalculationStepsNav from '@app/views/calculation/CalculationStepsNav.vue';

const routerService = getRouterService();

const { companyId, calculatorId } = routerService.getRouterParams();
if (!companyId || !calculatorId) {
  routerService.goTo(RouteNames.index);
}

const calculationStore = useCalculationStore();

const loading = computed(() => calculationStore.loadingStatus === 'loading');
const notFound = computed(
  () =>
    (calculationStore.loadingStatus === 'error' && calculationStore.error instanceof EntityNotFoundError) ||
    (calculationStore.loadingStatus === 'ready' && Object.values(calculationStore.steps).length === 0)
);
const error = computed(() => calculationStore.loadingStatus === 'error');

const currentStep = computed(() => calculationStore.currentStep);
const currentStepOrderNumber = computed(() => {
  if (!calculationStore.currentStepId) {
    return 0;
  }

  const idx = calculationStore.stepIndexById(calculationStore.currentStepId) ?? -1;
  return idx + 1;
});

const currentAnswer = computed(() => {
  if (!currentStep.value) {
    return null;
  }

  return calculationStore.answers[currentStep.value.id] != null;
});

const currentSubStep = computed(() => calculationStore.currentSubStep);

const loadCalculator = () => calculationStore.fetchCalculator(companyId as string, calculatorId as string);

loadCalculator();

const handleGoToNextStep = () => {
  calculationStore.goToNextStep();
};

const handleGoToPrevStep = () => {
  calculationStore.goToPrevStep();
};
</script>

<style lang="scss" scoped>
.calculation-view {
  &__component {
    &__wrapper {
      display: flex;
      align-items: flex-start;
      width: 100%;
    }
  }
}

.self-align-center {
  align-self: center;
}
</style>
