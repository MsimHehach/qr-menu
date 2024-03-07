<template>
  <template v-if="$pad.item?.isEnabled">
    <div class="no-wrap column text-on-background-color">
      <HomeMenus class="c-container" />
    </div>
  </template>
  <div
    v-else
    style="width: 100%; height: 100vh; text-align: center"
    class="row justify-center items-center header light"
  >
    В данный момент этот стол <br />
    не обслуживается
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import HomeMenus from 'src/pages/home/HomeMenus.vue'

onMounted(() => {
  menuGroupRepo.elementsInViewport = []
})
</script>
