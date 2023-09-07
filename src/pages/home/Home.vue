<template>
  <div>
    <div class="row no-wrap column pt-sm-20 pt-xs-10 text-on-background-color">
      <HomeProfile v-if="$q.screen.xs" class="c-container mb-5" />
      <HomeQrCard v-if="$q.screen.xs" class="c-container mb-15" />
      <HomeBonuses
        v-if="authentication.user && showBonuses"
        class="mb-20 mb-xs-10 mb-sm-15 c-container"
      />
      <HomeSpecialOffers />
      <HomeMenus class="c-container" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import HomeBonuses from './HomeBonuses.vue'
import HomeSpecialOffers from './HomeSpecialOffers.vue'
import { onMounted, computed } from 'vue'
import HomeMenus from './HomeMenus.vue'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { authentication } from 'src/models/authentication/authentication'
import HomeProfile from './HomeProfile.vue'
import HomeQrCard from './HomeQrCard.vue'

const showBonuses = computed(() => {
  return authentication.user?.wallets.filter((v) => v.type === 'bonus').length
})

onMounted(() => {
  menuGroupRepo.elementInViewport = null
})
</script>
