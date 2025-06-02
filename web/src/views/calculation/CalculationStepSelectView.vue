<template>
  <div class="flex flex-col justify-center align-middle">
    <n-h2>{{ title }}</n-h2>

    <n-radio-group v-model:value="answer" size="large" @update:value="$emit('answer', $event)">
      <n-collapse>
        <rh-collapse-item v-for="opt in options" :key="opt.id">
          <n-radio :value="opt.id" :label="opt.title" />
        </rh-collapse-item>
      </n-collapse>
    </n-radio-group>
  </div>
</template>

<script setup lang="ts">
import { NH2, NRadio, NRadioGroup, NCollapse } from 'naive-ui';
import { OptionItem } from '@/common/types';
import { ref, Ref } from 'vue';
import RhCollapseItem from '@app/components/RhCollapseItem.vue';

const { value } = defineProps<{
  options: OptionItem[];
  value: OptionItem['id'] | null;
  title: string;
}>();

defineEmits<{
  (e: 'answer', value: OptionItem['id'] | null): void;
}>();

console.log('select:value', value);

const answer: Ref<OptionItem['id'] | null> = ref(value);
</script>

<style lang="scss" scoped>
:deep(.n-radio) {
  width: 100%;
}
</style>
