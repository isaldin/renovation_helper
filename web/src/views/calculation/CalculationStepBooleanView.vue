<template>
  <div class="calculation-step-boolean-view">
    <rh-boolean-input :title="title" :value="stepAnswer" @answer="handleAnswer" />
  </div>
</template>

<script setup lang="ts">
import { CalculationStepViewEmits, CalculationStepViewProps } from '@app/views/calculation/CalculationStepView.types';
import RhBooleanInput from '@app/components/RhBooleanInput.vue';
import { useCalculationStore } from '@app/stores/calculation';
import { computed, ComputedRef, onMounted } from 'vue';

const { stepId, answersMap } = defineProps<CalculationStepViewProps>();

const emit = defineEmits<CalculationStepViewEmits>();

const store = useCalculationStore();

const stepAnswer: ComputedRef<boolean> = computed(() => {
  const answer = store.answers[stepId];
  if (answer == null) {
    return true;
  }

  return answer as boolean;
});

const handleAnswer = (answer: boolean) => {
  emit('update:answers-map', { [stepId]: answer });
};

onMounted(() => {
  if (answersMap[stepId] == null) {
    // Initialize with default value if not set
    emit('update:answers-map', { [stepId]: true });
  }
});
</script>

<style lang="scss" scoped>
.calculation-step-boolean-view {
  display: flex;
  min-height: 100%;
  align-items: center;
}
</style>
