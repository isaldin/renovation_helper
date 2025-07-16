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

  <calculation-step-layout v-else>
    <template #step-info>
      <calculation-steps-info-view :current-step-idx="currentStepOrderNumber" :total-steps-count="stepsCount" />
    </template>

    <template #step-view>
      <calculation-step-view
        v-if="visibleStep"
        :step="visibleStep"
        :answers-map="answersMap"
        @update:answers-map="handleUpdateAnswersMap"
      />
    </template>

    <template #navigation>
      <calculation-step-edit-nav
        v-if="isEditViewMode"
        :has-next-step="!!hasNextStep"
        :has-prev-step="!!hasPrevStep"
        :submit-available="submitAvailable"
        @cancel="handleEditViewCancel"
        @save="handleEditViewSave"
        @go:next="handleEditViewNextStep"
        @go:prev="handleEditViewPrevStep"
      />
      <calculation-steps-nav
        v-else
        :current-step-idx="currentStepOrderNumber"
        :total-steps-count="stepsCount"
        :disabled="!hasNextStep && !submitAvailable"
        @next="handleGoToNextStep"
        @prev="handleGoToPrevStep"
      >
        <template v-if="isSummaryStep" #right-button>
          <n-spin :show="saveCalculationInProgress" :size="16" stroke="white">
            <n-button type="primary" :disabled="saveCalculationInProgress" @click="handleGetReportClick">
              Получить расчет
            </n-button>
            <rh-modal :show-modal="showErrorModal">
              <n-card>
                <n-card title="Ошибка при сохранении" :bordered="false" size="small" role="dialog" aria-modal="true">
                  Пожалуйста, попробуйте еще раз позже или обратитесь к администратору.
                  <template #footer>
                    <div class="flex justify-end">
                      <n-button type="primary" size="small" @click="showErrorModal = false"> Ok </n-button>
                    </div>
                  </template>
                </n-card>
              </n-card>
            </rh-modal>
          </n-spin>
        </template>
      </calculation-steps-nav>
    </template>
  </calculation-step-layout>
</template>

<script lang="ts" setup>
import CalculationStepView from '@app/views/calculation/CalculationStepView.vue';
import { NButton, NCard, NH2, NSpin } from 'naive-ui';
import CalculationStepsInfoView from '@app/views/calculation/CalculationStepsInfoView.vue';
import CalculationStepsNav from '@app/views/calculation/CalculationStepsNav.vue';
import { useCalculation } from '@app/compositions/calculation/useCalculation';
import { useStepAnswersMap } from '@app/compositions/calculation/useStepAnswersMap';
import { computed, onMounted, ref, watch } from 'vue';
import { StepId } from '@/common/types';
import CalculationStepLayout from '@app/views/calculation/CalculationStepLayout.vue';
import { AnswersMap } from '@app/views/calculation/CalculationStepView.types';
import { useCalculationViewNav } from '@app/compositions/calculation/useCalculationViewNav';
import { getDefaultOptionId } from '@app/stores/calculation/helpers';
import CalculationStepEditNav from '@app/views/calculation/CalculationStepEditNav.vue';
import { AnswerType } from '@/common/types/calculator';
import { useCalculatorResults } from '@app/compositions/calculation/useCalculatorResults';
import RhModal from '@app/components/RhModal.vue';
import { useGetReport } from '@app/compositions/useGetReport';
import { getRouterService } from '@app/container';
import { RouteNames } from '@app/router/routeNames';

const {
  currentStep,
  loading,
  notFound,
  error,
  currentStepOrderNumber,
  loadCalculator,
  goToNextStep,
  goToPrevStep,
  setAnswerForStep,
  stepsCount,
  isStep,
  subStepForAnswer,
  answerForStepId,
  isEditMode,
  setEditMode,
  setSummaryStep,
  summaryStep,
  getCalculatorId,
  getAnswers,
} = useCalculation();

const { initialAnswersMap } = useStepAnswersMap(currentStep);

const answersMap = ref<AnswersMap>(currentStep.value ? initialAnswersMap(currentStep.value!.id) : {});

const isEditViewMode = computed(() => isEditMode.value);

const currenStepId = computed(() => currentStep.value?.id || null);
watch(
  currenStepId,
  (value) => {
    if (value) {
      answersMap.value = initialAnswersMap(value);
    }
  },
  { immediate: true }
);
const { hasPrevStep, hasNextStep, submitAvailable, navigateToNextStep, navigateToPrevStep, visibleStep } =
  useCalculationViewNav(currenStepId, answersMap);

const isSummaryStep = computed(() => summaryStep.value?.id && currentStep.value?.id === summaryStep.value?.id);

const handleGoToNextStep = () => {
  if (hasNextStep.value) {
    navigateToNextStep();
  } else if (submitAvailable) {
    Object.entries(answersMap.value).forEach(([key, value]: [StepId, AnswerType | null]) => {
      setAnswerForStep(key, value);
    });

    goToNextStep();
  }
};

const handleEditViewSave = () => {
  Object.entries(answersMap.value).forEach(([key, value]: [StepId, AnswerType | null]) => {
    setAnswerForStep(key, value);
  });
  setEditMode(false);
  setSummaryStep();
};

const handleEditViewCancel = () => {
  setEditMode(false);
  setSummaryStep();
};

const handleGoToPrevStep = () => {
  if (hasPrevStep.value) {
    navigateToPrevStep();
  } else {
    goToPrevStep();
  }
};

const handleEditViewNextStep = () => {
  navigateToNextStep();
};

const handleEditViewPrevStep = () => {
  navigateToPrevStep();
};

const handleUpdateAnswersMap = (newAnswersMap: AnswersMap) => {
  // check if step changed
  // in this case we need to reset sub-steps
  const stepChanged = Object.keys(newAnswersMap).length === 1 && isStep(Object.keys(newAnswersMap)[0]);

  const stepIds = Object.keys(newAnswersMap).filter(isStep);
  stepIds.forEach((stepId) => {
    const answer = newAnswersMap[stepId];
    if (answer) {
      const subStep = subStepForAnswer(stepId, answer);
      if (subStep && newAnswersMap[subStep.id] == null) {
        newAnswersMap[subStep.id] = answerForStepId(subStep.id) ?? getDefaultOptionId(subStep);
      }
    }
  });

  answersMap.value = stepChanged ? newAnswersMap : { ...answersMap.value, ...newAnswersMap };
};

const saveCalculationInProgress = ref(false);
const showErrorModal = ref(false);
const handleGetReportClick = async () => {
  saveCalculationInProgress.value = true;

  const calculatorId = getCalculatorId();
  const answers = getAnswers();

  if (!calculatorId) {
    return;
  }

  try {
    await useCalculatorResults().saveCalculatorResults(calculatorId, answers);
    await useGetReport().getReport();
    getRouterService().goTo(RouteNames.waitReport);
  } catch (error) {
    showErrorModal.value = true;
  } finally {
    saveCalculationInProgress.value = false;
  }
};

onMounted(() => {
  loadCalculator();
});
</script>

<style lang="scss" scoped>
.self-align-center {
  align-self: center;
}

.hs-screen {
  height: 100vh;
  height: 100dvh;
}
</style>
