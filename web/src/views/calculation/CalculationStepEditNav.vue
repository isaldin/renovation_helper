<template>
  <div class="calculation-step-edit-nav">
    <n-button v-if="hasPrevStep" @click="handleGoToPrev"> Назад </n-button>
    <n-button v-else @click="handleCancel"> Отмена </n-button>

    <n-button v-if="submitAvailable" type="primary" @click="$emit('save')"> Сохранить </n-button>
    <n-button v-else-if="hasNextStep" type="primary" @click="handleGoToNext"> Далее </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';

defineProps<{
  hasNextStep: boolean;
  hasPrevStep: boolean;
  submitAvailable: boolean;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'go:next'): void;
  (e: 'go:prev'): void;
  (e: 'cancel'): void;
}>();

const handleCancel = () => {
  emit('cancel');
};

const handleGoToPrev = () => {
  emit('go:prev');
};

const handleGoToNext = () => {
  emit('go:next');
};
</script>

<style lang="scss" scoped>
.calculation-step-edit-nav {
  display: flex;
  justify-content: space-between;
}
</style>
