<template>
  <div class="calculation-step-select-view">
    <rh-answer-select :title="title" :options="options" :value="stepAnswer" @answer="handleAnswer">
      <template v-if="embeddedSubStep" #append="{ itemValue }">
        <rh-boolean-input
          v-if="itemValue === stepAnswer"
          embed
          :title="embeddedSubStep.title"
          :value="embeddedStepAnswer as boolean"
          @answer="handleEmbeddedSubStepAnswer"
        />
      </template>
    </rh-answer-select>
  </div>
</template>

<script setup lang="ts">
import RhAnswerSelect from '@app/components/RhAnswerSelect.vue';
import { CalculationStepViewEmits, CalculationStepViewProps } from '@app/views/calculation/CalculationStepView.types';
import { computed, ComputedRef, watch } from 'vue';
import { useCalculationStore } from '@app/stores/calculation';
import { useSubStep } from '@app/compositions/calculation/useSubStep';
import { getDefaultOptionId, getOptionItems, isSubStepEmbedded } from '@app/stores/calculation/helpers';
import { OptionItem } from '@/common/types';
import { AnswerType } from '@app/stores/calculation/types';
import RhBooleanInput from '@app/components/RhBooleanInput.vue';

const { stepId, answersMap } = defineProps<CalculationStepViewProps>();

const emit = defineEmits<CalculationStepViewEmits>();

const store = useCalculationStore();

const step = computed(() => store.steps[stepId]);

const options = computed(() =>
  getOptionItems(store.steps[stepId] || store.subSteps.find((subStep) => subStep.id === stepId))
);

const stepAnswer: ComputedRef<OptionItem['id'] | null> = computed(
  () => (answersMap[stepId] as OptionItem['id']) ?? getDefaultOptionId(step.value) ?? null
);

const embeddedStepAnswer = computed(() => {
  if (!embeddedSubStep.value) {
    return null;
  }

  return answersMap[embeddedSubStep.value.id];
});

const { subStep } = useSubStep(step, stepAnswer);

const embeddedSubStep = computed(() => (subStep.value && isSubStepEmbedded(subStep.value) ? subStep.value : null));

const handleAnswer = (answer: OptionItem['id'] | null) => {
  emit('update:answers-map', { [stepId]: answer });
};

const handleEmbeddedSubStepAnswer = (answer: AnswerType | null) => {
  emit('update:answers-map', { ...answersMap, [embeddedSubStep.value!.id]: answer });
};
</script>

<style lang="scss" scoped>
.calculation-step-select-view {
  //
}
</style>
