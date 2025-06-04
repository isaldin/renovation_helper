<template>
  <div v-if="componentForStep" class="summary-item-view">
    <component :is="componentForStep" :step="step" :answer="answer">
      <template v-if="subStep" #sub-step>
        <component :is="getComponentForStep(subStep.type)" embedded :step="subStep" :answer="answerForSubStep" />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { AnswerType } from '@app/stores/calculation/types';
import { StepType, SubStep } from '@/common/types';
import { computed, defineAsyncComponent } from 'vue';
import { useCalculationStore } from '@app/stores/calculation';
import { SummaryItemProps } from '@app/components/summary/summary.types';

const { step, answer } = defineProps<SummaryItemProps>();

const store = useCalculationStore();

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
</script>

<style lang="scss" scoped>
.summary-item-view {
  //
}
</style>
