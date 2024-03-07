<template>
  <div
    v-if="!$route.matched.find((el) => el.name === 'arrangementPage')"
    class="c-container"
  >
    <div class="row justify-between items-center bg-background-color py-6">
      <div class="row items-center gap-10">
        <div
          v-for="(el, index) in blocks.filter((el) => el.visible)"
          :key="index"
          class="row items-center gap-14"
        >
          <div
            v-if="index"
            style="
              min-width: 7px;
              min-height: 7px;
              max-width: 7px;
              max-height: 7px;
              border-radius: 50%;
            "
            class="bg-secondary"
          ></div>
          <CButton @click="el.click()" text-button text-color="secondary-text">
            <div class="body bold">{{ el.label }}</div></CButton
          >
        </div>
      </div>
      <TopHeaderDeliveryInfo />
      <TopHeaderSocials />
    </div>
    <q-separator color="divider-color" />
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { store } from 'src/models/store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeaderSocials from './TopHeaderSocials.vue'
import TopHeaderDeliveryInfo from './TopHeaderDeliveryInfo.vue'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { companyRepo } from 'src/models/company/companyRepo'

const router = useRouter()

const route = useRoute()

const blocks = computed(() => {
  return [
    {
      label: 'О нас',
      visible: true,
      click: () => {
        router.push({
          name: 'aboutUs',
        })
      },
    },
    {
      label: 'Контакты',
      visible:
        !!companyRepo.item?.guestContacts.emails.length ||
        !!companyRepo.item?.guestContacts.phones.length,
      click: () => {
        scrollToBlock('footer')
      },
    },
    // {
    //   label: 'Разработчик',
    //   click: () => {
    //     window.open('https://corex.studio/', '_blank')
    //   },
    // },
    {
      label: 'Мобильное приложение',
      visible:
        appSettingsRepo.linksData &&
        (appSettingsRepo.linksData.app_redirect_link ||
          appSettingsRepo.linksData.android_download_link ||
          appSettingsRepo.linksData.ios_download_link),
      click: () => {
        scrollToBlock('footer')
      },
    },
  ]
})

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
