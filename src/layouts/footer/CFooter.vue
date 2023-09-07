<template>
  <div class="bg-backing-color">
    <q-separator />
    <div class="pb-md-10" style="bottom: 0; z-index: 2100">
      <div class="c-container" v-if="$q.screen.gt.sm">
        <div class="footer-wrap secondary-text row items-center pt-15">
          <FooterDesktop />
        </div>
      </div>
      <div class="footer-wrap py-10 px-10 row" v-else>
        <FooterMobile />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FooterDesktop from './FooterDesktop.vue'
import FooterMobile from './FooterMobile.vue'
</script>

<style scoped lang="scss">
.q-footer {
  min-height: 196px;
}

.footer-wrap {
  justify-content: space-between;
}
</style>
