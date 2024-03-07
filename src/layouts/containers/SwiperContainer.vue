<template>
  <div>
    <div
      v-if="$slots.top"
      class="row full-width no-wrap gap-5 justify-between mb-lg-15 mb-xs-10"
    >
      <slot name="top"></slot>
      <div class="row gap-4 no-wrap">
        <CIconButton
          @click="prevPage"
          icon="fa-regular fa-chevron-left"
          outline
          class="outlined-button"
          icon-color="on-background-color"
          icon-size="20px"
          size="46px"
        />
        <CIconButton
          @click="nextPage"
          icon="fa-regular fa-chevron-right"
          outline
          class="outlined-button"
          icon-color="on-background-color"
          icon-size="20px"
          size="46px"
        />
      </div>
    </div>
    <swiper
      @swiper="onSwiper"
      :space-between="spaceBetween || 20"
      :loop="loop"
      :slides-per-view="slidesPerView || 3"
      :pagination="{
        clickable: true,
      }"
      :mousewheel="{
        releaseOnEdges: true,
        sensitivity: 0.5,
        forceToAxis: true,
      }"
      :initial-slide="initialSlide"
      :modules="modules"
      navigation
      :class="noNavigation ? 'no-navigation' : 'navigation'"
    >
      <swiper-slide
        v-for="(item, index) in items"
        :key="index"
        :class="useBullets ? 'mb-10' : ''"
      >
        <slot name="item" v-bind:item="item"></slot>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Swiper as SwiperClass } from 'swiper'
import { Pagination, Navigation, Mousewheel } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { computed } from 'vue'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'

const props = defineProps<{
  items: Array<any>
  loop?: boolean
  spaceBetween?: number
  slidesPerView?: number
  useBullets?: boolean
  noNavigation?: boolean
  initialSlide?: number
}>()

let swiperInstance: SwiperClass | null = null

const modules = computed(() => {
  const res = []
  if (!props.noNavigation) res.push(Navigation)
  res.push(Mousewheel)
  if (props.useBullets) {
    res.push(Pagination)
  }

  return res
})

const nextPage = () => {
  swiperInstance?.slideNext()
}

const prevPage = () => {
  swiperInstance?.slidePrev()
}

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance = swiper
}
</script>

<style scoped lang="scss">
.swiper-click :deep(.swiper-pagination) {
  margin-left: -23% !important;
  z-index: 0;
}

.swiper :deep(.swiper-pagination) {
  position: unset;
}

.swiper :deep(.swiper-pagination-bullet) {
  width: 9px;
  height: 9px;
  opacity: 1;
  background: #898989;
}

.swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--primary);
  width: 9px;
  border-radius: 5px;
}

.navigation :deep(.swiper-button-prev) {
  color: black;
  height: 10px;
  width: 10px;
  margin-top: -40px;
  border: 20px rgba(255, 255, 255, 0.85) solid;
  border-radius: 50%;
}

.swiper :deep(.swiper-button-prev:after) {
  font-size: 20px;
}

.swiper :deep(.swiper-button-next:after) {
  font-size: 20px;
}

.navigation :deep(.swiper-button-next) {
  color: black;
  height: 10px;
  width: 10px;
  margin-top: -40px;
  border: 20px rgba(255, 255, 255, 0.85) solid;
  border-radius: 50%;
}

.no-navigation :deep(.swiper-button-next) {
  display: none;
}

.no-navigation :deep(.swiper-button-prev) {
  display: none;
}

.outlined-button :deep(.q-btn--outline:before) {
  border: 2px var(--secondary) solid !important;
  border-radius: 50%;
}

.outlined-button {
  border-radius: 50% !important;
  overflow: hidden !important;
}
</style>
