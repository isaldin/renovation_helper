<template>
  <div
    class="flex"
    :class="{
      'justify-between': !isFirst,
      'justify-end': isFirst,
      'justify-start': isLast,
    }"
  >
    <n-button v-if="!isFirst" tertiary circle>
      <template #icon>
        <n-icon @click="$emit('prev')">
          <arrow-back-icon />
        </n-icon>
      </template>
    </n-button>
    <n-button v-if="!isLast" :disabled="disabled" tertiary circle>
      <template #icon>
        <n-icon @click="disabled ? void 0 : $emit('next')">
          <arrow-forward-icon />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { NButton, NIcon } from 'naive-ui';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@vicons/ionicons5';

const { currentStepIdx, totalStepsCount } = defineProps<{
  disabled: boolean;
  currentStepIdx: number;
  totalStepsCount: number;
}>();

defineEmits<{
  (e: 'next'): void;
  (e: 'prev'): void;
}>();

const isFirst = computed(() => currentStepIdx === 1);
const isLast = computed(() => currentStepIdx === totalStepsCount);
</script>

<style lang="scss" scoped></style>
