<template>
  <div class="flex flex-col justify-center align-middle">
    <n-h2>{{ title }}</n-h2>

    <n-radio-group v-model:value="answer" size="large" @update:value="$emit('answer', $event)">
      <n-collapse>
        <rh-collapse-item v-for="opt in options" :key="opt.id">
          <n-radio :value="opt.id" :label="opt.title" />

          <template #collapseIcon="{ toggleCollapse }">
            <n-icon :size="24" color="green" @click="toggleCollapse">
              <eye-off-outline />
            </n-icon>
          </template>
          <template #expandIcon="{ toggleCollapse }">
            <n-icon :size="24" color="green" @click="toggleCollapse">
              <eye-outline />
            </n-icon>
          </template>

          <template v-if="opt.images" #collapsableContent>
            <rh-image-carousel :slides="getSlides(opt.images)" />
          </template>

          <template v-if="embeddedSubStep && opt.id === answer">
            <calculation-step-boolean-view
              embed
              :title="embeddedSubStep?.title"
              :value="undefined"
              @answer="handleEmbedSubStepAnswer"
            />
          </template>
        </rh-collapse-item>
      </n-collapse>
    </n-radio-group>
  </div>
</template>

<script setup lang="ts">
import { NH2, NRadio, NRadioGroup, NCollapse, NIcon } from 'naive-ui';
import { EyeOutline, EyeOffOutline } from '@vicons/ionicons5';
import { OptionItem, SubStep } from '@/common/types';
import { onMounted, ref, Ref } from 'vue';
import RhCollapseItem from '@app/components/RhCollapseItem.vue';
import RhImageCarousel from '@app/components/RhImageCarousel.vue';
import { RhImageCarouselPropsSlide } from '@app/components/RhImageCarousel.props';
import CalculationStepBooleanView from '@app/views/calculation/CalculationStepBooleanView.vue';
import { AnswerType } from '@app/stores/calculation/types';

const { value, title, options, embeddedSubStep } = defineProps<{
  options: OptionItem[];
  embeddedSubStep: SubStep | null;
  value: OptionItem['id'] | null;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'answer', value: OptionItem['id'] | null): void;
  (e: 'embedded-substep:answer', value: AnswerType): void;
}>();

const answer: Ref<OptionItem['id'] | null> = ref(value);

const getSlides = (images: string[]): RhImageCarouselPropsSlide[] => {
  return images.map((img, i) => ({
    id: `img_${i}`,
    imageUrl: img,
    title: '',
  }));
};

const handleEmbedSubStepAnswer = (answer: AnswerType) => {
  emit('embedded-substep:answer', answer);
};

onMounted(() => {
  const preloadImages = (images: string[]): void => {
    images.forEach((img) => {
      const image = new Image();
      image.src = img;
    });
  };

  options.forEach((option) => {
    if (option.images && option.images.length > 0) {
      preloadImages(option.images);
    }
  });
});
</script>

<style lang="scss" scoped>
:deep(.n-radio) {
  width: 100%;
}
</style>
