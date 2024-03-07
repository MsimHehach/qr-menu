<template>
  <div ref="footer" class="bg-bottom-menu-color">
    <q-separator v-if="!$q.screen.xs" />
    <div class="pb-md-30 pb-xs-5" style="bottom: 0; z-index: 2100">
      <div class="c-container" v-if="$q.screen.gt.sm">
        <div class="footer-wrap row items-center pt-15">
          <FooterDesktop />
        </div>
      </div>
      <div class="footer-wrap py-15 px-8 row" v-else>
        <FooterMobile />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from 'src/models/store'
import FooterDesktop from './FooterDesktop.vue'
import FooterMobile from './FooterMobile.vue'
import { onMounted, ref } from 'vue'

const footer = ref<HTMLDivElement>()

onMounted(() => {
  setTimeout(() => {
    store.footerHeight = footer.value?.clientHeight || 0
    document.addEventListener('resize', () => {
      store.footerHeight = footer.value?.clientHeight || 0
    })
  }, 50)
})
</script>

<style scoped lang="scss">
.q-footer {
  min-height: 196px;
}

.footer-wrap {
  justify-content: space-between;
}
</style>
