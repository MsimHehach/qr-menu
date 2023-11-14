<template>
  <div>
    <SwiperContainer
      use-bullets
      class="swiper"
      :slides-per-view="slidesPerView"
      :items="items"
    >
      <template v-slot:item="{ item }">
        <div
          style="height: 400px; overflow: hidden"
          class="cursor-pointer offer-block box-shadow body border-radius column justify-center no-wrap bg-backing-color relative-position"
        >
          <q-img
            :src="getImage(item.image) || $store.images.empty"
            :style="`border-radius:${getBorderRadius}`"
            height="180px"
            style="min-height: 400px; position: absolute"
            fit="cover"
          >
            <template v-slot:error>
              <span>
                <q-img
                  class="user-image"
                  fit="cover"
                  height="500px"
                  :src="$store.images.empty"
                ></q-img>
              </span>
            </template>
          </q-img>
          <div
            style="z-index: 10; padding-left: 10%; width: 45%"
            class="text-white huge"
          >
            {{ item.text }}
            <div class="full-width">
              <CButton
                icon-right="fa-light fa-arrow-right"
                color="white"
                class="mt-5 bold"
                text-color="black"
              >
                Перейти к выбору</CButton
              >
            </div>
          </div>
        </div>
      </template></SwiperContainer
    >
  </div>
</template>
<script lang="ts" setup>
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { store } from 'src/models/store'
import CButton from 'src/components/template/buttons/CButton.vue'

const q = useQuasar()

const slidesPerView = computed(() => {
  return q.screen.xs ? 1.2 : q.screen.sm ? 1.2 : 1.2
})

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})

const items = [
  {
    image: 'slide1.jpg',
    text: 'Сытная линейка WOK — от 399 ₽',
  },
  {
    image: 'slide2.jpg',
    text: 'Знаменитый тайский суп Том Ям — от 369 ₽',
  },
  {
    image: 'slide3.jpg',
    text: 'Популярное блюдо гавайской кухни Поке — от 499 ₽',
  },
]

const getImage = (fileName: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('assets/' + fileName) as string
  } catch {
    return store.images.empty
  }
}
</script>

<style lang="scss" scoped>
.swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
  padding-top: 3px;
}

.swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
  @media (max-width: 1919px) {
    max-width: 1420px;
  }
  @media (min-width: 1919px) {
    max-width: 1480px;
  }
}
body.screen--xl {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    @media (max-width: 1560px) {
      padding-left: 60px;
      padding-right: 60px;
    }

    @media (min-width: 1560px) {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
}

body.screen--lg {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 40px;
    padding-right: 40px;
  }
}

body.screen--md {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
  }
}

body.screen--sm {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
