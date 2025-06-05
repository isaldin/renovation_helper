<template>
  <div v-if="loading" class="flex justify-center align-middle hs-screen px-4">
    <n-spin size="large" />
  </div>

  <div v-else-if="notFound" class="flex justify-center align-middle px-4 hs-screen">
    <n-h2 class="self-align-center"> Калькулятор не найден </n-h2>
  </div>

  <div v-else-if="error" class="flex justify-center align-middle hs-screen flex-col px-4">
    <n-h2>Ошибка загрузки калькулятора</n-h2>
    <n-button type="info" @click="loadCalculator"> Попробовать заново </n-button>
  </div>

  <div v-else class="calculation-view flex justify-center align-middle flex-col min-h-screen p-4">
    <div class="calculation-view__step-info flex justify-center align-middle">
      <calculation-steps-info-view :current-step-idx="currentStepOrderNumber" :total-steps-count="stepsCount" />
    </div>

    <div class="calculation-view__component flex flex-1 flex-wrap justify-center">
      <div class="calculation-view__component__wrapper">
        <calculation-step-view
          v-model:answer="answer"
          v-model:sub-step-answer="subStepAnswer"
          :step="currentSubStep || currentStep!"
          :embedded-sub-step="embeddedSubStep"
          @update:embedded-substep-answer="handleEmbeddedSubStepAnswer"
        />
      </div>
    </div>

    <calculation-steps-nav
      class="calculation-view__navigation"
      :current-step-idx="currentStepOrderNumber"
      :total-steps-count="stepsCount"
      :disabled="answer == null"
      @next="handleGoToNextStep"
      @prev="handleGoToPrevStep"
    >
      <template v-if="stepFromRoute && stepFromRoute.id !== summaryStep?.id" #default>
        <div class="flex justify-between">
          <n-button v-if="!currentSubStep" size="small" @click="handleGoToSummaryClick"> Отмена </n-button>
          <n-button v-else size="small" @click="handleGoParentStepClick"> Назад </n-button>

          <n-button
            v-if="hasNotEmbeddedSubStep && !currentSubStep"
            size="small"
            type="primary"
            @click="handleGoToEditSubStepClick"
          >
            Далее
          </n-button>
          <n-button v-else size="small" type="primary" @click="handleSaveClick"> Сохранить </n-button>
        </div>
      </template>
    </calculation-steps-nav>
  </div>
</template>

<script lang="ts" setup>
import { getRouterService } from '@app/container';
import { RouteNames } from '@app/router/routeNames';
import CalculationStepView from '@app/views/calculation/CalculationStepView.vue';
import { NButton, NH2, NSpin } from 'naive-ui';
import CalculationStepsInfoView from '@app/views/calculation/CalculationStepsInfoView.vue';
import CalculationStepsNav from '@app/views/calculation/CalculationStepsNav.vue';
import { AnswerType } from '@app/stores/calculation/types';
import { useCalculation } from '@app/compositions/calculation/useCalculation';
import { useStepAnswer } from '@app/compositions/calculation/useStepAnswer';
import { useSubStep } from '@app/compositions/calculation/useSubStep';
import { computed, onMounted, ref, watch } from 'vue';
import { SubStepBoolean } from '@/common/types';

const routerService = getRouterService();

const {
  currentStep,
  currentSubStep,
  loading,
  notFound,
  error,
  currentStepOrderNumber,
  loadCalculator,
  goToNextStep,
  goToPrevStep,
  setAnswerForStep,
  stepFromRoute,
  stepsCount,
  summaryStep,
  setSummaryStep,
  getAnswerForStep,
} = useCalculation();

const answer = useStepAnswer(currentStep);
const { embeddedSubStep, subStepForAnswer } = useSubStep(currentStep, answer);

const subStepAnswer = ref<AnswerType | null>(null);

const hasNotEmbeddedSubStep = computed(
  () =>
    subStepForAnswer.value &&
    (subStepForAnswer.value.type !== 'boolean' || !(subStepForAnswer.value as SubStepBoolean).embed)
);

watch(embeddedSubStep, (value) => {
  if (!value) {
    subStepAnswer.value = null;
  } else {
    subStepAnswer.value = getAnswerForStep(value.id);
  }
});

watch(currentSubStep, (value) => {
  if (!value) {
    subStepAnswer.value = null;
  } else {
    subStepAnswer.value = getAnswerForStep(value.id);
  }
});

const handleGoToNextStep = () => {
  setAnswerForStep(currentStep.value!.id, answer.value);

  if (subStepAnswer.value != null) {
    setAnswerForStep(embeddedSubStep.value?.id || currentSubStep.value!.id, subStepAnswer.value);
  }

  goToNextStep();
};

const handleGoToPrevStep = () => {
  goToPrevStep();
};

const handleGoToSummaryClick = () => {
  const { companyId, calculatorId } = routerService.getRouterParams() as Record<string, string>;
  routerService.goTo(RouteNames.calculation, { companyId, calculatorId });
};

const handleEmbeddedSubStepAnswer = (answer: AnswerType | null) => {
  subStepAnswer.value = answer;
};

const handleSaveClick = () => {
  if (embeddedSubStep.value) {
    setAnswerForStep(embeddedSubStep.value.id, subStepAnswer.value);
  }
  setAnswerForStep(currentStep.value!.id, answer.value);
  if (subStepAnswer.value != null) {
    setAnswerForStep(embeddedSubStep.value?.id || currentSubStep.value!.id, subStepAnswer.value);
  }

  setSummaryStep();
  const { companyId, calculatorId } = routerService.getRouterParams() as Record<string, string>;
  routerService.goTo(RouteNames.calculation, { companyId, calculatorId });
};

const handleGoToEditSubStepClick = () => {
  const { companyId, calculatorId } = routerService.getRouterParams() as Record<string, string>;
  routerService.goTo(RouteNames.calculation, {
    companyId,
    calculatorId,
    stepId: currentStep.value!.id,
    subStepId: subStepForAnswer.value!.id,
  });
};

const handleGoParentStepClick = () => {
  const { companyId, calculatorId } = routerService.getRouterParams() as Record<string, string>;
  routerService.goTo(RouteNames.calculation, {
    companyId,
    calculatorId,
    stepId: currentStep.value!.id,
  });
};

onMounted(() => {
  loadCalculator();
});
</script>

<style lang="scss" scoped>
.calculation-view {
  &__component {
    &__wrapper {
      display: flex;
      align-items: flex-start;
      width: 100%;
      margin-bottom: 48px;
    }
  }

  &__navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 999;
    padding: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px 0, rgba(0, 0, 0, 0.1) 0 0 1px 0;
  }
}

.self-align-center {
  align-self: center;
}

.hs-screen {
  height: 100vh;
  height: 100dvh;
}
</style>
