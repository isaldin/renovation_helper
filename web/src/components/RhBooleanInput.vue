<template>
  <div class="rh-boolean-input flex flex-col">
    <n-h2 v-if="!embed">
      {{ title }}
    </n-h2>
    <div v-else class="rh-boolean-input__title--embed">
      {{ title }}
    </div>

    <div class="rh-boolean-input__buttons">
      <n-button-group size="large">
        <n-button
          v-for="item in BOOLEAN_ITEMS"
          :key="item.title"
          class="rh-boolean-input__buttons__button"
          :size="embed ? 'small' : 'large'"
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

const { value, defaultValue = true } = defineProps<{
  value: boolean | null;
  title: string;
  embed?: boolean;
  defaultValue?: boolean;
}>();

const emit = defineEmits<{
  (e: 'answer', value: boolean): void;
}>();

const answer: Ref<boolean> = ref(value ?? defaultValue);

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
.rh-boolean-input {
  flex: 1;

  &__title {
    &--embed {
      font-size: 14px;
      line-height: 18px;
      text-align: center;
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

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
