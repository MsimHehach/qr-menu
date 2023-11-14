<template>
  <q-header class="text-black transition bg-background-color">
    <div class="c-container full-height column">
      <div style="height: 60px" class="row no-wrap items-center">
        <div
          class="no-wrap row cursor-pointer items-center gap-5"
          :class="
            $companyGroup.item?.externalId === 'corex_demo'
              ? 'pr-lg-45 pr-md-25 pr-sm-10 pr-xs-10'
              : 'pr-lg-35 pr-md-20 pr-sm-10 pr-xs-10'
          "
          @click="$router.push({ name: 'home' })"
        >
          <template v-if="$companyGroup.item?.externalId !== 'corex_demo'">
            <img
              v-if="$uiSettings.item?.logo?.thumbnail"
              height="50"
              style="object-fit: cover"
              width="50"
              class="border-radius"
              :src="$uiSettings.item?.logo?.thumbnail"
            />
            <div class="header2">
              {{ $companyGroup.item?.name }}
            </div>
          </template>
          <img
            v-else
            style="object-fit: contain"
            width="170"
            :src="$uiSettings.item?.logo?.thumbnail"
          />
        </div>
        <div class="col-grow row items-center gap-15 body">
          <ServiceSettingsBlock v-if="authentication.user" />
          <ServiceSettingsSkeleton v-if="authentication.loading" />
          <template v-if="$companyGroup.item?.externalId !== 'corex_demo'">
            <template v-if="!$q.screen.lt.md">
              <CButton
                @click="scrollToBlock('offers', 'Новости')"
                class="body pl-10"
                label="Новости"
                text-button
                text-color="on-background-color"
              />
              <CButton
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
          </template>
          <div
            v-else
            class="row no-wrap gap-10 justify-between"
            :class="
              authentication.user
                ? 'col-lg-6 col-xl-7 col-md-7'
                : 'col-lg-8 col-xl-7 col-md-9'
            "
          >
            <div
              v-if="authentication.user ? $q.screen.gt.md : $q.screen.gt.sm"
              class="row gap-6 no-wrap"
            >
              <CIcon name="fa-light fa-phone" color="red" />
              <div class="column gap-1 no-wrap">
                <div class="bold mt-1">+7 (401) 292-13-20</div>
                <div class="secondary-text text-secondary">
                  Звоните прямо сейчас!
                </div>
              </div>
            </div>
            <template
              v-if="authentication.user ? $q.screen.gt.md : $q.screen.gt.sm"
            >
              <div class="row gap-6 no-wrap">
                <CIcon name="fa-light fa-clock" color="red" />
                <div class="column gap-1 no-wrap">
                  <div class="bold mt-1">Принимаем заказы 11:00-22:45</div>
                  <div class="secondary-text text-secondary">
                    заказ и доставка суши и роллов на дом
                  </div>
                </div>
              </div>
            </template>
          </div>
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
import CIcon from 'src/components/template/helpers/CIcon.vue'

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
