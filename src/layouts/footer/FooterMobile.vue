<template>
  <div id="footer" class="text-on-bottom-menu-color full-width">
    <div class="row full-width justify-between gap-8">
      <div class="col column gap-8">
        <div class="header3 bold">Информация</div>
        <div class="column full-width gap-6">
          <div v-for="(el, index) in infoBlocks" :key="index">
            <CButton
              @click="el.click()"
              text-button
              class="body"
              style="opacity: 0.7"
              :label="el.label"
              text-color="on-bottom-menu-color"
            />
          </div>
        </div>
      </div>
      <div v-if="showContacts" class="col column gap-8">
        <div class="header3 bold">Контакты</div>
        <div class="column full-width gap-6" style="overflow: hidden">
          <template
            v-for="(item, index) in $company.item?.guestContacts.emails"
            :key="index"
          >
            <div style="opacity: 0.7" class="body">
              {{ item.value }}
            </div>
          </template>
          <template
            v-for="(item, index) in $company.item?.guestContacts.phones"
            :key="index"
          >
            <div style="opacity: 0.7" class="body">
              {{ item.value }}
            </div>
          </template>
          <template
            v-for="(item, index) in $company.item?.guestContacts.socials"
            :key="index"
          >
            <div
              @click="openLink(item.link)"
              style="opacity: 0.7"
              class="body cursor-pointer"
            >
              {{ item.value }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="
        $appSettings.linksData &&
        ($appSettings.linksData.app_redirect_link ||
          $appSettings.linksData.android_download_link ||
          $appSettings.linksData.ios_download_link)
      "
      class="column mt-15 full-width gap-10 no-wrap"
    >
      <div class="header3 bold">Скачать мобильное приложение</div>
      <div class="row full-width gap-12 items-center no-wrap">
        <div
          v-if="qrCode && $appSettings.linksData.app_redirect_link"
          class="border-radius"
          style="width: 93px; height: 93px; min-width: 93px; overflow: hidden"
        >
          <img width="93" height="93" :src="qrCode" alt="QR Code" />
        </div>
        <div class="column gap-6">
          <img
            v-if="$appSettings.linksData.ios_download_link"
            @click="openLink($appSettings.linksData.ios_download_link)"
            class="cursor-pointer"
            style="
              height: 40px;
              background-color: #2e2e2e;
              object-fit: contain;
              border-radius: 7px;
              width: 100%;
            "
            src="assets/Apple.svg"
          />
          <img
            v-if="$appSettings.linksData.android_download_link"
            @click="openLink($appSettings.linksData.android_download_link)"
            class="cursor-pointer"
            style="
              height: 40px;
              background-color: #2e2e2e;
              object-fit: contain;
              border-radius: 7px;
              width: 100%;
            "
            src="assets/Google.svg"
          />
        </div>
      </div>
    </div>
    <!-- <div class="row full-width gap-7 mt-25">
      <div
        v-for="(el, index) in developersLinks"
        :key="index"
        @click="el.click"
        class="border-radius row justify-center items-center cursor-pointer"
        style="background-color: #424242; width: 40px; height: 40px"
      >
        <CIcon color="white" :name="el.icon" />
      </div>
    </div> -->
    <div class="column mt-10 full-width gap-6 body mt-15">
      <div>© 2023 все права защищены</div>
      <CButton
        text-color="on-bottom-menu-color"
        text-button
        style="opacity: 0.7; width: fit-content"
        class="body"
        label="Политика конфиденциальноости"
        @click="
          openLink(
            `https://loyalhub.ru/${String(
              $companyGroup.item?.externalId,
            )}/policy`,
          )
        "
      />
      <CButton
        @click="
          openLink(
            `https://loyalhub.ru/${String(
              $companyGroup.item?.externalId,
            )}/terms_of_service`,
          )
        "
        class="body"
        text-color="on-bottom-menu-color"
        text-button
        style="opacity: 0.7; width: fit-content"
        label="Условия использования"
      />
      <div class="row no-wrap gap-3">
        <div style="opacity: 0.7">Работает на</div>
        <q-img style="width: 30px" src="assets/loyalHeart.svg" />
        <a
          style="opacity: 0.7"
          class="text-on-bottom-menu-color"
          href="https://corex.studio/loyal"
        >
          Loyalhub</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import CButton from 'src/components/template/buttons/CButton.vue'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { store } from 'src/models/store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import * as qr from 'qr-ts'

const route = useRoute()

const router = useRouter()

let qrCode: any = null

const infoBlocks = computed(() => {
  return [
    {
      label: 'Акции и новости',
      click: () => {
        scrollToBlock('offers')
      },
    },
    {
      label: 'О разработчике',
      click: () => {
        window.open('https://corex.studio/', '_blank')
      },
    },
    {
      label: 'О заведении',
      click: () => {
        router.push({
          name: 'aboutUs',
        })
      },
    },
  ]
})

const showContacts = computed(() => {
  return (
    !!companyRepo.item?.guestContacts.emails.length ||
    !!companyRepo.item?.guestContacts.phones.length ||
    !!companyRepo.item?.guestContacts.socials.length
  )
})

// const developersLinks = [
//   {
//     icon: 'fa-solid fa-paper-plane',
//     click: () => {
//       void 0
//     },
//   },
//   {
//     icon: 'fa-solid fa-envelope',
//     click: () => {
//       void 0
//     },
//   },
//   {
//     icon: 'fa-brands fa-youtube',
//     click: () => {
//       void 0
//     },
//   },
// ]

// const navigation = computed(() => {
//   return [
//     {
//       label: 'Новости',
//       hidden: !!!newsRepo.items.length,
//       click: () => {
//         scrollToBlock('offers', 'Новости')
//       },
//     },
//     {
//       label: 'Акции',
//       hidden: !promotionsRepo.items.length,
//       click: () => {
//         scrollToBlock('offers', 'Акции')
//       },
//     },
//     {
//       label: 'О разработчике',
//       click: () => {
//         openLink('https://corex.studio/')
//       },
//     },
//     {
//       label: 'Политика конфиденциальности',
//       click: () => {
//         openLink(
//           `https://loyalhub.ru/${String(route.params.companyGroup)}/policy`
//         )
//       },
//     },
//     {
//       label: 'Пользовательское соглашение',
//       click: () => {
//         openLink(
//           `https://loyalhub.ru/${String(
//             route.params.companyGroup
//           )}/terms_of_service`
//         )
//       },
//     },
//   ]
// })

// const getImage = (link: LinkType | null) => {
//   let fileName: string | null = null

//   try {
//     if (link === LinkType.MAPS) fileName = 'yandexMaps.png'
//     if (link === LinkType.OK) fileName = 'okLogo.png'
//     if (link === LinkType.TELEGRAM) fileName = 'telegramLogo.png'
//     if (link === LinkType.VK) fileName = 'VKLogo.png'
//     if (link === LinkType.WEBSITE) fileName = 'websiteIcon.png'

//     return require('assets/' + fileName) as string
//   } catch {
//     return store.images.empty
//   }
// }

// const createQrs = () => {
//   let iosCode: HTMLCanvasElement | null = null
//   let androidCode: HTMLCanvasElement | null = null
//   if (appSettingsRepo.linksData?.ios_download_link) {
//     iosCode = qr.renderOnCanvas(
//       qr.generate(appSettingsRepo.linksData?.ios_download_link),
//       'iosQr'
//     )
//   }
//   if (appSettingsRepo.linksData?.android_download_link) {
//     androidCode = qr.renderOnCanvas(
//       qr.generate(appSettingsRepo.linksData?.android_download_link),
//       'androidQr'
//     )
//   }
//   const iosQrElement = document.getElementById('iosQr')
//   const androidQrElement = document.getElementById('androidQr')

//   if (iosCode && iosQrElement) {
//     iosCode.style.height = '99px'
//     iosQrElement.replaceWith(iosCode)
//   }
//   if (androidCode && androidQrElement) {
//     androidCode.style.height = '99px'
//     androidQrElement.replaceWith(androidCode)
//   }
// }

// const scrollToGroup = (v: MenuGroup) => {
//   const groupElement = document.getElementById(v.id)
//   if (groupElement) {
//     const y = groupElement.getBoundingClientRect().top + window.scrollY - 100

//     window.scrollTo({ top: y, behavior: 'smooth' })
//   }
// }

const openLink = (link: string) => {
  window.open(link, '_blank')
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

if (appSettingsRepo.linksData?.app_redirect_link)
  qrCode = useQRCode(appSettingsRepo.linksData?.app_redirect_link, {
    type: 'image/png',
    color: {
      light: '#424242',
      dark: '#fff',
    },
  })
</script>

<style lang="scss" scoped></style>
