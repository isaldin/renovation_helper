<template>
  <div class="rh-image-carousel">
    <vueper-slides :slide-ratio="1">
      <vueper-slide v-for="slide in slides" :key="slide.id" :image="slide.imageUrl" :title="slide.title" />
    </vueper-slides>
  </div>
</template>

<script lang="ts" setup>
import { RhImageCarouselPropsSlide } from '@app/components/RhImageCarousel.props';

defineProps<{
  slides: Array<RhImageCarouselPropsSlide>;
}>();

import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
</script>
