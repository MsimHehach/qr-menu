<template>
  <div id="footer" class="row full-width">
    <div class="column col-8 justify-between">
      <div class="row gap-40">
        <div v-if="$menu.item?.groups?.length" class="column">
          <div class="bold mb-10 text-on-backing-color">Меню</div>
          <div class="row gap-25">
            <div class="column gap-7">
              <div
                v-for="(item, index) in $menu.item.groups.filter(
                  (_, ind) => ind < 10
                )"
                :key="index"
              >
                <CButton
                  @click="scrollToGroup(item)"
                  text-button
                  class="secondary-text"
                  :label="item.name"
                  text-color="on-backing-color"
                />
              </div>
            </div>
            <div class="column gap-7" style="min-width: 100px">
              <div
                v-for="(item, index) in $menu.item.groups.filter(
                  (_, ind) => ind >= 10 && ind < 20
                )"
                :key="index"
              >
                <CButton
                  @click="scrollToGroup(item)"
                  text-button
                  class="secondary-text"
                  :label="item.name"
                  text-color="on-backing-color"
                />
              </div>
            </div>
          </div>
        </div>

        <divs>
          <div class="bold mb-10 text-on-backing-color">Навигация</div>
          <div class="column text-black3 gap-7">
            <template v-for="(item, index) in navigation" :key="index">
              <div
                v-if="!item.hidden"
                @click="item.click"
                class="text-on-backing-color cursor-pointer secondary-text"
              >
                {{ item.label }}
              </div>
            </template>
          </div>
        </divs>
      </div>
      <div class="column gap-8 text-on-backing-color mt-20">
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
    <div class="col-grow text-on-backing-color">
      <template
        v-if="
          $appSettings.linksData?.android_download_link ||
          $appSettings.linksData?.ios_download_link
        "
      >
        <div class="header mb-10">Скачать приложение</div>
        <div class="column text-black3 mb-15">
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
      </template>
      <div v-if="showContacts" class="column gap-8">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { LinkType } from 'src/models/company/company'
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { store } from 'src/models/store'
import * as qr from 'qr-ts'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { computed, onMounted } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { useRoute, useRouter } from 'vue-router'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'

const route = useRoute()
const router = useRouter()

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
          `https://loyal.corex.studio/${String(
            route.params.companyGroup
          )}/policy`
        )
      },
    },
    {
      label: 'Пользовательское соглашение',
      click: () => {
        openLink(
          `https://loyal.corex.studio/${String(
            route.params.companyGroup
          )}/terms_of_service`
        )
      },
    },
    // {
    //   label: 'cookie',
    //   click: void 0,
    // },
  ]
})

const showContacts = computed(() => {
  return (
    !!companyRepo.item?.guestContacts.emails.length ||
    !!companyRepo.item?.guestContacts.phones.length ||
    !!companyRepo.item?.guestContacts.socials.length
  )
})

const scrollToGroup = (v: MenuGroup) => {
  const groupElement = document.getElementById(v.id)
  if (groupElement) {
    const y = groupElement.getBoundingClientRect().top + window.scrollY - 100

    window.scrollTo({ top: y, behavior: 'smooth' })
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

const openLink = (link: string) => {
  window.open(link, '_blank')
}

onMounted(() => {
  createQrs()
})
</script>

<style lang="scss" scoped></style>
