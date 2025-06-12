<template>
  <div class="flex flex-col justify-center align-middle">
    <n-h2>{{ title }}</n-h2>
    <n-input-number
      ref="inputRef"
      v-model:value="answer"
      size="large"
      :min="MIN"
      :max="MAX"
      :status="status"
      button-placement="both"
      @blur="handleBlur"
    >
      <template #suffix> м2 </template>
    </n-input-number>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, onMounted, watch } from 'vue';
import { NH2, NInputNumber } from 'naive-ui';

const MIN = 30;
const MAX = 500;

const inputRef = ref<{ displayedValue: string | number }>();

const props = defineProps<{
  value: number | null;
  title: string;
}>();

const emits = defineEmits<{
  (e: 'update:value', value: number | null): void;
}>();

const answer: Ref<number | null> = ref(props.value || MIN);

watch(
  () => props.value,
  (val) => {
    if (val !== answer.value) {
      answer.value = val ?? MIN;
    }
  }
);

watch(answer, (val) => {
  emits('update:value', val);
});

const rawValue = computed(() => inputRef.value?.displayedValue || 'not_initialized');

const isValid = computed(() => {
  if (rawValue.value === 'not_initialized') {
    return true;
  }
  if (!rawValue.value) {
    return false;
  }

  const rawValueInt = parseInt('' + rawValue.value);

  if (!rawValueInt || rawValueInt < MIN || rawValueInt > MAX) {
    return false;
  }

  return true;
});

const status = computed(() => {
  if (!isValid.value) {
    return 'error';
  }

  return 'success';
});

const handleBlur = () => {
  if (answer.value === null) {
    answer.value = MIN;
  } else if (answer.value < MIN) {
    answer.value = MIN;
  } else if (answer.value > MAX) {
    answer.value = MAX;
  }
};

watch(isValid, (value) => {
  if (!value) {
    emits('update:value', null);
  } else {
    emits('update:value', answer.value);
  }
});

onMounted(() => {
  if (props.value !== answer.value) {
    emits('update:value', answer.value);
  }
});
</script>
