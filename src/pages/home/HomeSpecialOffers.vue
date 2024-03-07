<template>
  <div id="offers">
    <div class="row c-container gap-6 items-center text-on-background-color">
      <div
        v-for="(el, index) in tabs"
        :key="index"
        class="row gap-6 items-center huge3 bold"
      >
        <div
          v-if="index"
          style="width: 9px; height: 9px; border-radius: 50%"
          class="bg-secondary-text"
        ></div>
        <div
          @click="$store.offersTab = el"
          :class="
            $store.offersTab !== el ? 'text-secondary-text' : 'text-primary'
          "
          class="cursor-pointer bold"
        >
          {{ el }}
        </div>
      </div>
    </div>

    <SwiperContainer
      class="swiper"
      :initial-slide="1"
      no-navigation
      :slides-per-view="slidesPerView"
      :items="$store.offersTab === 'Новости' ? $news.news : $news.promotions"
    >
      <template v-slot:item="{ item }">
        <div
          :style="`overflow: hidden; height: ${
            $q.screen.gt.md ? '190px' : $q.screen.lt.md ? '150px' : '300px'
          } `"
          @click="goToItem(item)"
          class="cursor-pointer body border-radius column no-wrap bg-backing-color mt-15"
        >
          <q-img
            :src="item.image?.thumbnail || $store.images.empty"
            :style="`border-radius:${getBorderRadius}; object-position: left 50%;`"
            height="100%"
            position="left"
            fit="cover"
          >
            <template v-slot:error>
              <span>
                <q-img
                  fit="cover"
                  height="100%"
                  :src="$store.images.empty"
                ></q-img>
              </span>
            </template>
          </q-img>
        </div> </template
    ></SwiperContainer>
    <!-- <SwiperContainer
      v-else
      class="swiper"
      :initial-slide="1"
      :slides-per-view="slidesPerView"
      :items="banners"
    >
      <template v-slot:item="{ item }">
        <div
          style="overflow: hidden; height: 360px"
          class="cursor-pointer body border-radius no-wrap bg-backing-color mb-20 mt-15 column justify-center"
        >
          <q-img
            :src="getImage(item.image)"
            height="360px"
            class="border-radius"
            fit="cover"
            style="position: absolute"
          >
            <template v-slot:error>
              <span>
                <q-img
                  fit="cover"
                  height="100%"
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
          </div>
        </div></template
      >
    </SwiperContainer> -->
    <div
      v-if="$store.offersTab === 'Новости' && !$news.news.length"
      class="header3 pl-6 my-20 c-container"
    >
      У вас нет новостей
    </div>
    <div
      v-if="$store.offersTab === 'Акции' && !$news.promotions.length"
      class="header3 pl-6 my-lg-20 mt-xs-10 c-container"
    >
      У вас нет акций
    </div>
  </div>
</template>

<script setup lang="ts">
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { computed } from 'vue'
import { News } from 'src/models/news/news'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { useQuasar } from 'quasar'
import { store } from 'src/models/store'
import { newsRepo } from 'src/models/news/newsRepo'

const q = useQuasar()

// const banners = [
//   {
//     image: 'baner1.jpg',
//     text: 'Натуральные лимонады Starbar Craft',
//   },
//   {
//     image: 'baner2.jpg',
//     text: 'Знаменитый тайский суп Том Ям — от 369 ₽',
//   },
//   {
//     image: 'baner1.jpg',
//     text: 'Натуральные лимонады Starbar Craft',
//   },
//   {
//     image: 'baner2.jpg',
//     text: 'Знаменитый тайский суп Том Ям — от 369 ₽',
//   },
//   {
//     image: 'baner1.jpg',
//     text: 'Натуральные лимонады Starbar Craft',
//   },
//   {
//     image: 'baner2.jpg',
//     text: 'Знаменитый тайский суп Том Ям — от 369 ₽',
//   },
// ]

const tabs = computed(() => {
  const result = []
  result.push('Новости')
  result.push('Акции')
  return result
})

const slidesPerView = computed(() => {
  return q.screen.lt.md ? 1.2 : q.screen.lt.lg ? 2 : 4

  // store.offersTab === 'Акции'
  //   ? 1
  //   :
})

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})

// const getImage = (link: string) => {
//   try {
//     return require('assets/' + link) as string
//   } catch {
//     return store.images.empty
//   }
// }

const goToItem = (item: News) => {
  void newsRepo.retrieve(item.id)
  store.newsModal = true
}
</script>

<style lang="scss" scoped>
// .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
//   @media (max-width: 1919px) {
//     max-width: 1420px;
//   }
//   @media (min-width: 1919px) {
//     max-width: 1480px;
//   }
// }
body.screen--xl {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    @media (max-width: 1560px) {
      padding-left: calc((100vw - (1170px)) / 2);
      padding-right: calc((100vw - (1170px)) / 2);
    }

    @media (min-width: 1560px) {
      padding-left: calc((100vw - (1290px)) / 2);
      padding-right: calc((100vw - (1290px)) / 2);
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

body.screen--xs {
  .swiper :deep(.swiper.swiper-initialized.swiper-horizontal) {
    width: 100%;
    margin: 0 auto;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
