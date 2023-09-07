<template>
  <q-header class="text-black transition bg-background-color">
    <div class="c-container full-height column">
      <div style="height: 60px" class="row no-wrap items-center">
        <div
          class="col-sm-5 col-md-3 col-lg-2 col-xs-5 row cursor-pointer"
          @click="$router.push({ name: 'home' })"
        >
          <img height="50" :src="$uiSettings.item?.logo?.thumbnail" />
        </div>
        <div class="col-grow row gap-15 body">
          <ServiceSettingsBlock v-if="authentication.user" />

          <ServiceSettingsSkeleton v-if="authentication.loading" />
          <template v-if="!$q.screen.lt.md">
            <CButton
              v-if="$news.items.length"
              @click="scrollToBlock('offers', 'Новости')"
              class="body pl-10"
              label="Новости"
              text-button
              text-color="on-background-color"
            />
            <CButton
              v-if="$promotion.items.length"
              @click="scrollToBlock('offers', 'Акции')"
              class="body"
              label="Акции"
              text-button
              text-color="on-background-color"
            />
            <CButton
              @click="scrollToBlock('footer')"
              class="body"
              label="Контакты"
              text-button
              text-color="on-background-color"
            />
          </template>
        </div>
        <div class="row no-wrap gap-8">
          <!-- <CButton
            v-if="authentication.user && !$q.screen.sm"
            class="box-shadow"
            height="33px"
            style="border-radius: 100px"
            icon="fa-light fa-piggy-bank"
            color="background-color"
            text-color="primary"
            >{{
              authentication.user && authentication.user.wallets[0]
                ? authentication.user.wallets[0].balance
                : 'Бонусы'
            }}</CButton
          > -->

          <CButton
            v-if="!authentication.loading"
            @click="profileButtonClickHandler()"
            class="box-shadow"
            height="33px"
            color="background-color"
            text-color="primary"
            style="border-radius: 100px"
            icon="fa-light fa-user"
            :label="authentication.user ? 'Профиль' : 'Войти'"
          />
        </div>
      </div>
    </div>
    <q-separator class="divider-color" />
  </q-header>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsBlock from 'src/components/serviceSettings/ServiceSettingsBlock.vue'
import { store } from 'src/models/store'
import { useRoute, useRouter } from 'vue-router'
import ServiceSettingsSkeleton from 'src/components/serviceSettings/ServiceSettingsSkeleton.vue'

const router = useRouter()

const route = useRoute()

const profileButtonClickHandler = () => {
  if (authentication.user) {
    void router.push({ name: 'profilePage' })
  } else {
    store.authModal = true
  }
}

const scrollToBlock = (v: string, tab?: string) => {
  if (route.name !== 'home') {
    void router.push({
      name: 'home',
    })
    setTimeout(() => {
      scrollToBlock(v, tab)
    }, 300)
  } else {
    const groupElement = document.getElementById(v)
    if (groupElement) {
      if (tab) store.offersTab = tab
      const y = groupElement.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped lang="scss">
.q-header {
  position: relative;
}
</style>
