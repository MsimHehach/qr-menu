<template>
  <div
    v-if="$news.item"
    style="min-height: 450px"
    class="pt-20 text-on-background-color"
  >
    <div
      :class="$q.screen.xs ? 'column reverse' : 'row '"
      class="full-width justify-between"
    >
      <div class="column col-sm-6 col-xs-12" style="overflow-x: hidden">
        <div class="header mb-sm-15 mb-xs-10">{{ $news.item.title }}</div>

        <div
          v-if="$news.item.fullDescription"
          v-html="$news.item.fullDescription"
        ></div>
        <div v-else>-</div>
      </div>
      <div
        :class="{ 'full-width': $q.screen.xs }"
        class="col-sm-5 mb-xs-10 mb-sm-0"
      >
        <q-img
          v-if="$news.item.images.length < 2"
          style="max-height: 500px; height: 100%"
          :style="$q.screen.xs ? 'height: 200px' : ''"
          class="rounded-15"
          fit="contain"
          :src="$news.item.image?.thumbnail || $store.images.empty"
        >
          <template v-slot:error>
            <span>
              <q-img
                class="user-image"
                fit="cover"
                :height="$q.screen.xs ? '200px' : '320px'"
                :src="$store.images.empty"
              ></q-img>
            </span> </template
        ></q-img>
        <SwiperContainer
          v-else
          no-navigation
          class="col"
          use-bullets
          :slides-per-view="1.1"
          :items="$news.item.images"
        >
          <template v-slot:item="{ item }">
            <!-- :style="`border-radius:${getBorderRadius}`" -->
            <q-img
              class="border-radius"
              :src="item.thumbnail || $store.images.empty"
              fit="contain"
              style="max-height: 320px; min-height: 320px"
            >
              <template v-slot:error>
                <span>
                  <q-img
                    class="border-radius"
                    style="
                      max-height: 320px !important;
                      min-height: 320px !important;
                    "
                    :src="$store.images.empty"
                  ></q-img>
                </span>
              </template>
            </q-img> </template
        ></SwiperContainer>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { newsRepo } from 'src/models/news/newsRepo'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  void newsRepo.retrieve(String(route.params.newsId))
})
</script>

<style lang="scss" scoped></style>
