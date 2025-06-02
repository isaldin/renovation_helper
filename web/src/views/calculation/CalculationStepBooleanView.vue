<template>
  <div class="calculation-step-boolean-view flex flex-col">
    <n-h2>{{ title }}</n-h2>

    <div class="calculation-step-boolean-view__buttons">
      <n-button-group size="large">
        <n-button
          v-for="item in BOOLEAN_ITEMS"
          :key="item.title"
          class="calculation-step-boolean-view__buttons__button"
          size="large"
          :type="item.value === answer ? 'primary' : 'default'"
          @click="handleButtonClick(item.value)"
        >
          {{ item.title }}
        </n-button>
      </n-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { NH2, NButtonGroup, NButton } from 'naive-ui';

const BOOLEAN_ITEMS = [
  {
    title: 'Да',
    value: true,
  },
  {
    title: 'Нет',
    value: false,
  },
];

const { value } = defineProps<{
  value?: boolean;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'answer', value: boolean): void;
}>();

const answer: Ref<boolean> = ref(value ?? true);

const handleButtonClick = (value: boolean) => {
  answer.value = value;
  emit('answer', value);
};

onMounted(() => {
  if (value !== answer.value) {
    emit('answer', answer.value);
  }
});
</script>

<style lang="scss" scoped>
.calculation-step-boolean-view {
  flex: 1;
  height: 100%;

  &__buttons {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    :deep(.n-button-group) {
      width: 100%;
    }

    &__button {
      flex: 1;
    }
  }
}
</style>
