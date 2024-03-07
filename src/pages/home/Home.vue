<template>
  <div>
    <div
      class="row no-wrap column pt-lg-20 pt-md-10 pt-xs-8 text-on-background-color"
    >
      <!-- <HomeHugeSlider v-if="$companyGroup.item?.externalId === 'corex_demo'" /> -->
      <!-- <HomeProfile v-if="$q.screen.xs" class="c-container mb-5" /> -->
      <!-- <HomeQrCard v-if="$q.screen.xs" class="c-container mb-15" /> -->
      <!-- <HomeBonuses
        v-if="authentication.user && showBonuses"
        class="mb-20 mb-xs-10 mb-sm-15 c-container"
      /> -->
      <!-- <BottomHeader /> -->

      <HomeSpecialOffers />
      <HomeMenus class="c-container" />
    </div>
  </div>
</template>
<script lang="ts" setup>
// import HomeBonuses from './HomeBonuses.vue'
import HomeSpecialOffers from './HomeSpecialOffers.vue'
import { onMounted } from 'vue'
import HomeMenus from './HomeMenus.vue'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
// import { authentication } from 'src/models/authentication/authentication'
// import HomeProfile from './HomeProfile.vue'
// import HomeQrCard from './HomeQrCard.vue'
// import BottomHeader from 'src/layouts/header/BottomHeader.vue'
// import HomeHugeSlider from './HomeHugeSlider.vue'

// const showBonuses = computed(() => {
//   return authentication.user?.wallets.filter((v) => v.type === 'bonus').length
// })

onMounted(() => {
  menuGroupRepo.elementsInViewport = []
})
</script>
