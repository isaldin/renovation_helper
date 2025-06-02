<template>
  <n-h3>{{ `Шаг ${currentStepIdx} из ${totalStepsCount}` }}</n-h3>
</template>

<script lang="ts" setup>
import { NH3 } from 'naive-ui';
defineProps<{
  currentStepIdx: number;
  totalStepsCount: number;
}>();
</script>
