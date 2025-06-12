<template>
  <div v-if="componentForStep" class="summary-item-view">
    <component :is="componentForStep" :step="step" :answer="answer">
      <template v-if="subStep" #sub-step>
        <component :is="getComponentForStep(subStep.type)" embedded :step="subStep" :answer="answerForSubStep" />
      </template>
    </component>
    <n-icon class="summary-item-view__edit-btn" :size="16" @click="handleEditStepClick(step.id)">
      <create-outline />
    </n-icon>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui';
import { CreateOutline } from '@vicons/ionicons5';
import { AnswerType } from '@app/stores/calculation/types';
import { StepId, StepType, SubStep } from '@/common/types';
import { computed, defineAsyncComponent } from 'vue';
import { useCalculationStore } from '@app/stores/calculation';
import { SummaryItemProps } from '@app/components/summary/summary.types';
import { useCalculation } from '@app/compositions/calculation/useCalculation';

const { step, answer } = defineProps<SummaryItemProps>();

const store = useCalculationStore();
const { setEditMode, setCurrentStep } = useCalculation();

const summaryComponentItemsMap: Record<StepType, any> = {
  boolean: defineAsyncComponent(() => import('@app/components/summary/SummaryBooleanItem.vue')),
  calc: null,
  checkbox: null,
  select: defineAsyncComponent(() => import('@app/components/summary/SummarySelectItem.vue')),
  number: defineAsyncComponent(() => import('@app/components/summary/SummaryNumberItem.vue')),
};

const getComponentForStep = (stepType: StepType) => {
  return summaryComponentItemsMap[stepType] || null;
};

const componentForStep = computed(() => getComponentForStep(step.type) || null);

const subStep = computed((): SubStep | null => {
  if (!answer) {
    return null;
  }

  return store.subStepForAnswer(step.id, answer) || null;
});

const answerForSubStep = computed((): AnswerType | null => {
  if (!subStep.value) {
    return null;
  }

  return store.answers[subStep.value.id] || null;
});

const handleEditStepClick = (stepId: StepId) => {
  setEditMode(true);
  setCurrentStep(stepId);
};
</script>

<style lang="scss" scoped>
.summary-item-view {
  position: relative;

  &__edit-btn {
    position: absolute;
    right: 16px;
    top: 0;
  }
}
</style>
