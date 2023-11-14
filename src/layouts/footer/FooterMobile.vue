<template>
  <q-list style="width: 100%">
    <CExpansionItem
      head-classes="py-5 full-width justify-between"
      expand-icon-size="12"
      :label="$menu.item?.name || 'Меню'"
      text-color="on-backing-color"
      text-color-expanded="on-backing-color"
    >
      <template v-for="(item, index) in $menu.item?.groups" :key="index">
        <div
          @click="scrollToGroup(item)"
          style="font-size: 13px"
          class="text-on-backing-color cursor-pointer py-2"
        >
          {{ item.name }}
        </div>
      </template>
    </CExpansionItem>
    <q-separator color="divider-color" />
  </q-list>
  <q-list style="width: 100%">
    <CExpansionItem
      head-classes="py-5 full-width justify-between"
      expand-icon-size="12"
      :label="'Навигация'"
      text-color="on-backing-color"
      text-color-expanded="on-backing-color"
    >
      <template v-for="(item, index) in navigation" :key="index">
        <div
          v-if="!item.hidden"
          @click="item.click"
          style="font-size: 13px"
          class="text-on-backing-color cursor-pointer py-2"
        >
          {{ item.label }}
        </div>
      </template>
    </CExpansionItem>
    <q-separator color="divider-color" />
  </q-list>
  <div class="row gap-sm-5 gap-xs-5 justify-between full-width pb-12">
    <div
      v-if="
        $appSettings.linksData?.android_download_link ||
        $appSettings.linksData?.ios_download_link
      "
      :class="{ 'full-width': $q.screen.xs }"
    >
      <div class="column text-black3">
        <div class="header2 full-width mb-5 text-on-backing-color mt-8">
          Скачать приложение
        </div>
        <div class="row full-width gap-10">
          <div
            @click="openLink($appSettings.linksData.ios_download_link)"
            class="column gap-5 cursor-pointer"
          >
            <div
              class="border-radius"
              style="width: 99px; height: 99px; overflow: hidden"
            >
              <div id="iosQr"></div>
            </div>
            <img style="width: 99px" src="~assets/downloadApple.png" />
          </div>
          <div
            @click="openLink($appSettings.linksData.android_download_link)"
            class="column gap-10 cursor-pointer"
          >
            <div
              class="border-radius"
              style="width: 99px; height: 99px; overflow: hidden"
            >
              <div id="androidQr"></div>
            </div>
            <img style="width: 99px" src="~assets/downloadGoogle.png" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="column gap-8 text-on-backing-color justify-end mt-sm-8"
      :style="$q.screen.sm ? 'width: 430px' : ''"
    >
      <div v-if="showContacts" class="column gap-5">
        <div class="bold">Контакты</div>
        <div class="column full-width gap-3">
          <div
            v-for="(el, index) in $company.item?.guestContacts.phones"
            :key="index"
          >
            {{ el.value }}
          </div>
        </div>

        <div class="column full-width gap-3">
          <div
            v-for="(el, index) in $company.item?.guestContacts.emails"
            :key="index"
          >
            {{ el.value }}
          </div>
        </div>
        <div class="row no-wrap gap-7">
          <div
            v-for="(el, index) in $company.item?.guestContacts.socials"
            :key="index"
            @click="openLink(el.link)"
            class="cursor-pointer"
          >
            <q-img width="24px" fit="contain" :src="getImage(el.link_type)">
              <q-tooltip>{{ el.name }}</q-tooltip>
            </q-img>
          </div>
        </div>
      </div>
      <div class="column gap-5">
        © Все права защищены 2023

        <div>
          Если вы тоже хотите стать обладателем системы лояльности, переходите
          <a
            href="https://corex.studio/loyal"
            target="_blank"
            class="text-primary"
            >сюда</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CExpansionItem from 'src/components/template/panels/CExpansionItem.vue'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'
import { store } from 'src/models/store'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as qr from 'qr-ts'
import { companyRepo } from 'src/models/company/companyRepo'
import { LinkType } from 'src/models/company/company'

const route = useRoute()

const router = useRouter()

const showContacts = computed(() => {
  return (
    !!companyRepo.item?.guestContacts.emails.length ||
    !!companyRepo.item?.guestContacts.phones.length ||
    !!companyRepo.item?.guestContacts.socials.length
  )
})

const navigation = computed(() => {
  return [
    {
      label: 'Новости',
      hidden: !!!newsRepo.items.length,
      click: () => {
        scrollToBlock('offers', 'Новости')
      },
    },
    {
      label: 'Акции',
      hidden: !promotionsRepo.items.length,
      click: () => {
        scrollToBlock('offers', 'Акции')
      },
    },
    {
      label: 'О разработчике',
      click: () => {
        openLink('https://corex.studio/')
      },
    },
    {
      label: 'Политика конфиденциальности',
      click: () => {
        openLink(
          `https://loyalhub.ru/${String(route.params.companyGroup)}/policy`
        )
      },
    },
    {
      label: 'Пользовательское соглашение',
      click: () => {
        openLink(
          `https://loyalhub.ru/${String(
            route.params.companyGroup
          )}/terms_of_service`
        )
      },
    },
  ]
})

const getImage = (link: LinkType | null) => {
  let fileName: string | null = null

  try {
    if (link === LinkType.MAPS) fileName = 'yandexMaps.png'
    if (link === LinkType.OK) fileName = 'okLogo.png'
    if (link === LinkType.TELEGRAM) fileName = 'telegramLogo.png'
    if (link === LinkType.VK) fileName = 'VKLogo.png'
    if (link === LinkType.WEBSITE) fileName = 'websiteIcon.png'

    return require('assets/' + fileName) as string
  } catch {
    return store.images.empty
  }
}

const createQrs = () => {
  let iosCode: HTMLCanvasElement | null = null
  let androidCode: HTMLCanvasElement | null = null
  if (appSettingsRepo.linksData?.ios_download_link) {
    iosCode = qr.renderOnCanvas(
      qr.generate(appSettingsRepo.linksData?.ios_download_link),
      'iosQr'
    )
  }
  if (appSettingsRepo.linksData?.android_download_link) {
    androidCode = qr.renderOnCanvas(
      qr.generate(appSettingsRepo.linksData?.android_download_link),
      'androidQr'
    )
  }
  const iosQrElement = document.getElementById('iosQr')
  const androidQrElement = document.getElementById('androidQr')

  if (iosCode && iosQrElement) {
    iosCode.style.height = '99px'
    iosQrElement.replaceWith(iosCode)
  }
  if (androidCode && androidQrElement) {
    androidCode.style.height = '99px'
    androidQrElement.replaceWith(androidCode)
  }
}

const scrollToGroup = (v: MenuGroup) => {
  const groupElement = document.getElementById(v.id)
  if (groupElement) {
    const y = groupElement.getBoundingClientRect().top + window.scrollY - 100

    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

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

onMounted(() => {
  createQrs()
})
</script>

<style lang="scss" scoped></style>
