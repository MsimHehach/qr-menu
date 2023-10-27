<template>
  <template v-if="ready">
    <PrepareUiSettings />
    <q-layout view="lHh Lpr lFf" class="bg-background-color pb-xs-27 pb-sm-0">
      <div
        ref="header"
        style="position: sticky; top: 0px; z-index: 99"
        :style="
          $store.verticalScroll > 45
            ? 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.06)'
            : ''
        "
      >
        <template v-if="!$q.screen.xs">
          <MainHeader />
          <BottomHeader />
        </template>
        <div class="full-width" v-if="$q.screen.lt.sm">
          <MobileMenu />
        </div>
      </div>
      <q-page-container
        :style="`min-height: calc(100vh - ${footerAndHeaderHeight}px);`"
        :class="{
          'c-container':
            $route.name !== 'home' &&
            !routesWithoutContainerPaddings.some((v) =>
              $route.path.includes(v)
            ),
        }"
        style="padding-bottom: 50px"
      >
        <!-- {{ $route.name }} -->
        <router-view />
        <CartDrawer />
      </q-page-container>

      <q-footer>
        <CFooter
          ref="footer"
          class="full-width"
          style="bottom: 0; z-index: 2100"
        />
      </q-footer>
    </q-layout>
    <AuthModal
      :model-value="$store.authModal"
      @update:model-value="$store.authModal = $event"
    />
    <ServiceSettingsModal
      :model-value="$store.serviceSettingsModal"
      @update:model-value="$store.serviceSettingsModal = false"
    />
    <SelectCompanyModal
      :model-value="$store.selectCompanyModal"
      @update:model-value="$store.selectCompanyModal = false"
      @select="companySelected($event)"
    />
  </template>
</template>

<script setup lang="ts">
import MainHeader from './header/MainHeader.vue'
import CFooter from 'src/layouts/footer/CFooter.vue'
import { Screen, useQuasar } from 'quasar'
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from 'src/models/store'
import BottomHeader from './header/BottomHeader.vue'
import AuthModal from 'src/pages/auth/AuthModal.vue'
import { authentication } from 'src/models/authentication/authentication'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import PrepareUiSettings from 'src/components/template/PrepareUiSettings.vue'
import { handleMessage } from 'src/models/webSocket/webSocketRepo'
import { newsRepo } from 'src/models/news/newsRepo'
import { promotionsRepo } from 'src/models/promotion/promotionsRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import MobileMenu from './MobileMenu.vue'
import CartDrawer from './drawer/cart/CartDrawer.vue'
import ServiceSettingsModal from 'src/components/serviceSettings/ServiceSettingsModal.vue'
import SelectCompanyModal from 'src/components/dialogs/SelectCompanyModal.vue'
import { Company } from 'src/models/company/company'
import { companyRepo } from 'src/models/company/companyRepo'

const webSocket = ref<WebSocket | null>(null)

const routesWithoutContainerPaddings = ['promotion']

const q = useQuasar()
const route = useRoute()
const router = useRouter()
const ready = ref(false)

const header = ref<HTMLDivElement>()
const footer = ref<HTMLDivElement>()
const footerHeight = ref(0)
const headerHeight = ref(0)

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
  () => q.screen.name,
  () => {
    if (route.name === 'menuPage' && q.screen.lt.md) {
      void router.push({ name: 'testPage' })
    }
  }
)

const footerAndHeaderHeight = computed(() => {
  return Screen.gt.sm ? headerHeight.value + footerHeight.value : '0'
})

const setBodyScrollClass = () => {
  if (q.platform.is.win) {
    const body = document.getElementsByTagName('body')
    if (body.length) body[0].classList.add('custom-scroll-bar')
  }
}

onMounted(async () => {
  window.addEventListener('scroll', () => {
    store.verticalScroll = window.scrollY
  })
  salesPointRepo.menuLoading = true
  store.getCompanyGroup(String(route.params.companyGroup))
  setBodyScrollClass()
  await companyGroupRepo.current()
  await uiSettingsRepo.fetchSettings()
  void appSettingsRepo.getLinksSettings(String(route.params.companyGroup))

  setTimeout(() => {
    headerHeight.value = header.value?.clientHeight || 0
    footerHeight.value = footer.value?.clientHeight || 0
    document.addEventListener('resize', () => {
      headerHeight.value = header.value?.clientHeight || 0
      footerHeight.value = footer.value?.clientHeight || 0
    })
  }, 50)

  try {
    await authentication.validateTokens()
    void authentication.me()
    await cartRepo.current()
  } catch {
    authentication.loading = false
    ready.value = true
  }

  if (!newsRepo.items.length)
    void newsRepo.list({
      company_group: companyGroupRepo.item?.id,
    })
  if (!promotionsRepo.items.length)
    void promotionsRepo.list({
      company_group: companyGroupRepo.item?.id,
    })

  void store.loadCatalog(
    cartRepo.item
      ? cartRepo.item?.salesPoint
      : companyGroupRepo.item?.companies[0]?.salesPoints
      ? companyGroupRepo.item?.companies[0]?.salesPoints[0]
      : ''
  )

  ready.value = true
})

const companySelected = (v: Company) => {
  companyRepo.cartCompany = v
  store.selectCompanyModal = false
  store.serviceSettingsModal = true
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
