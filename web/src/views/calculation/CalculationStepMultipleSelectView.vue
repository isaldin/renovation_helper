<template>
  <div class="flex flex-col justify-center align-middle">
    <n-h2>{{ title }}</n-h2>
    <n-checkbox-group v-model:value="answer" @update:value="$emit('answer', $event)">
      <rh-collapse-item v-for="opt in options" :key="opt.id">
        <n-checkbox :value="opt.id" :label="opt.title" size="large" />
      </rh-collapse-item>
    </n-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { NH2, NCheckbox, NCheckboxGroup } from 'naive-ui';
import { OptionItem } from '@/common/types';
import { ref, Ref } from 'vue';
import RhCollapseItem from '@app/components/RhCollapseItem.vue';

const { value } = defineProps<{
  options: OptionItem[];
  value: OptionItem['id'][] | null;
  title: string;
}>();

defineEmits<{
  (e: 'answer', value: OptionItem['id'][] | null): void;
}>();

const answer: Ref<OptionItem['id'][] | null> = ref(value);
</script>

<style lang="scss" scoped>
:deep(.n-checkbox) {
  width: 100%;
}
</style>
