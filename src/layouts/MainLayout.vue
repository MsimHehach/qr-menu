<template>
  <template v-if="ready">
    <PrepareUiSettings />
    <q-layout class="bg-background-color relative-position" view="lHh Lpr lFf">
      <QRHomePadInfo v-if="$store.tableMode && $route.name === 'qrHome'" />
      <TopHeader v-if="$q.screen.gt.md" />
      <MainHeader />

      <div v-if="$q.screen.lt.md" class="full-width">
        <QRMobileMenu
          v-if="
            $store.tableMode &&
            $pad.item?.isEnabled &&
            $route.name !== 'qrMenuItemPage'
          "
        />
      </div>
      <q-page-container
        :class="{
          'c-container':
            $route.name !== 'home' &&
            $route.name !== 'qrHome' &&
            $route.name !== 'aboutUs' &&
            !routesWithoutContainerPaddings.some((v) =>
              $route.path.includes(v)
            ),
        }"
        :style="
          $q.screen.lt.md
            ? 'padding-bottom: 50px'
            : `min-height: calc(100vh - ${footerAndHeaderHeight}px); padding-bottom: 100px`
        "
      >
        <router-view />
        <CartDrawer />
        <LeftDrawer v-if="$q.screen.lt.lg" />
        <CartOverlayButton v-if="!$route.path.includes('arrangement')" />
      </q-page-container>

      <q-footer v-if="!$store.tableMode">
        <CFooter class="full-width" style="bottom: 0; z-index: 2100" />
      </q-footer>
    </q-layout>
    <AuthModal
      :model-value="$store.authModal"
      @update:model-value="$store.authModal = !!$event"
    />
    <ServiceSettingsModal
      :model-value="$store.serviceSettingsModal"
      @update:model-value="$store.serviceSettingsModal = false"
    />
    <SelectCompanyModal
      :model-value="$store.selectCompanyModal"
      @select="companySelected($event)"
      @update:model-value="$store.selectCompanyModal = false"
    />
    <MenuItemModal v-model="$store.menuItemModal" />
    <NewsModal
      :model-value="$store.newsModal"
      @update:model-value="closeNewsModal()"
    />

    <RegistrationModal v-model="$store.registrationModal" />
  </template>
</template>

<script lang="ts" setup>
import MainHeader from './header/MainHeader.vue'
import { Screen, useQuasar } from 'quasar'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from 'src/models/store'
import AuthModal from 'src/pages/auth/AuthModal.vue'
import { authentication } from 'src/models/authentication/authentication'
import PrepareUiSettings from 'src/components/template/PrepareUiSettings.vue'
import { handleMessage } from 'src/models/webSocket/webSocketRepo'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'
import CartDrawer from './drawer/cart/CartDrawer.vue'
import ServiceSettingsModal from 'src/components/serviceSettings/ServiceSettingsModal.vue'
import SelectCompanyModal from 'src/components/dialogs/SelectCompanyModal.vue'
import { Company } from 'src/models/company/company'
import { companyRepo } from 'src/models/company/companyRepo'
import CFooter from './footer/CFooter.vue'
import { padRepo } from 'src/models/pads/padRepo'
import QRMobileMenu from 'src/pages/qrMenu/QRMobileMenu.vue'
import QRHomePadInfo from 'src/pages/qrMenu/home/QRHomePadInfo.vue'
import MenuItemModal from 'src/pages/menuItem/MenuItemModal.vue'
import NewsModal from 'src/pages/news/NewsModal.vue'
import RegistrationModal from 'src/pages/auth/RegistrationModal.vue'
import CartOverlayButton from './drawer/cart/CartOverlayButton.vue'
import TopHeader from './header/TopHeader.vue'
import LeftDrawer from './drawer/LeftDrawer.vue'
import { AppManager } from 'src/models/utils/appManager'

const webSocket = ref<WebSocket | null>(null)

const routesWithoutContainerPaddings = [
  'promotion',
  'current_order',
  'order_review',
  'menu_item',
]

const q = useQuasar()
const route = useRoute()
const router = useRouter()
const ready = ref(false)

watch(
  () => authentication.user?.id,
  (v) => {
    if (!v) return
    webSocket.value = new WebSocket(`wss://loyalhub.ru/ws/customers/${v}/`)
    webSocket.value.onmessage = (event) => {
      handleMessage(event)
    }
  }
)

watch(
  () => padRepo.item?.id,
  (v) => {
    if (!v) return
    if (store.tableMode) {
      webSocket.value = new WebSocket(`wss://loyalhub.ru/ws/pads/${v}/`)
      webSocket.value.onmessage = (event) => {
        handleMessage(event)
      }
    }
  }
)

watch(
  () => q.screen.name,
  () => {
    if (route.name === 'menuPage' && q.screen.lt.md) {
      void router.push({ name: 'testPage' })
    }
  }
)

const footerAndHeaderHeight = computed(() => {
  return Screen.gt.sm ? store.headerHeight + store.footerHeight : 0
})

onMounted(async () => {
  const manager = new AppManager({
    companyGroupId: route.query.group ? String(route.query.group) : undefined,
    initMenuPage: true,
  })

  await manager.initApp()
  ready.value = true
  // if (route.path.includes('qr_menu')) {
  //   store.tableMode = true
  // }
  // salesPointRepo.menuLoading = true
  // setBodyScrollClass()
  // if (!store.tableMode) {
  //   store.getCompanyGroup(String(route.params.companyGroup))
  //   await getCurrentCompanyGroup()
  //   changeFavicon(companyGroupRepo.item?.image?.thumbnail)
  //   await uiSettingsRepo.fetchSettings()
  //   await appSettingsRepo.getLinksSettings(String(route.params.companyGroup))
  //   try {

  //   } catch {
  //     authentication.loading = false
  //     ready.value = true
  //     cartRepo.loading = false
  //   }
  // if (!newsRepo.news.length) {
  //   void newsRepo
  //     .list({
  //       company_group: companyGroupRepo.item?.id,
  //       active: true,
  //       type: NewsType.DEFAULT,
  //     })
  //     .then((res) => {
  //       newsRepo.news = res.items
  //     })
  // }
  // if (!newsRepo.promotions.length) {
  //   void newsRepo
  //     .list({
  //       company_group: companyGroupRepo.item?.id,
  //       active: true,
  //       type: NewsType.PROMOTION,
  //     })
  //     .then((res) => {
  //       newsRepo.promotions = res.items
  //     })
  // }

  // } else {
  //   Object.assign(api.defaults.headers, {
  //     ['User-Role']: 'pad_manager',
  //   })
  //   Object.assign(api.defaults.headers, {
  //     ['Company-Group']: route.params.companyGroup,
  //   })
  //   void uiSettingsRepo.fetchSettings()
  //   await padRepo.retrieve(String(route.params.padId))
  //   if (!padRepo.item?.companyGroup) return
  //   await companyGroupRepo.retrieve(padRepo.item.companyGroup)
  //   changeFavicon(companyGroupRepo.item?.image?.thumbnail)
  //   store.getCompanyGroup(String(companyGroupRepo.item?.externalId))
  //   void store.loadCatalog(padRepo.item?.salesPoint?.id || '')
  //   void waiterCallRepo
  //     .list({
  //       pad: padRepo.item.id,
  //     })
  //     .then(() => {
  //       waiterCallRepo.item = waiterCallRepo.items[0]
  //     })
  //   void orderRepo.current(padRepo.item)
  //   void cartRepo.current(padRepo.item.salesPoint?.id, padRepo.item)
  // }

  // ready.value = true
})

const companySelected = (v: Company | null) => {
  if (!authentication.user) {
    if (!v || !v.salesPoints || !v.salesPoints.length) return
    void store.loadCatalog(v.salesPoints[0])
    store.selectCompanyModal = false
  } else {
    companyRepo.cartCompany = v
    store.selectCompanyModal = false
    store.serviceSettingsModal = true
  }
}

const closeNewsModal = () => {
  newsRepo.item = null
  promotionsRepo.item = null
  store.newsModal = false
}
</script>

<style lang="scss" scoped>
.q-page-container {
  padding-top: 0px !important;
}

.q-footer {
  position: relative;
}
</style>
