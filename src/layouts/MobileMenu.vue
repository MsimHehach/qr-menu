<template>
  <div class="fixed-bottom" style="z-index: 3005">
    <div class="row justify-center full-width">
      <div
        @click="openQrPage()"
        class="qr-block cursor-pointer bg-qr-color column justify-center items-center pt-1"
      >
        <CIcon color="on-qr-color" name="fa-light fa-qrcode" size="25px" />
        <div style="font-size: 10px" class="text-on-qr-color">QR</div>
      </div>
    </div>
    <div
      class="row no-wrap items-center justify-between kek bg-bottom-menu-color"
    >
      <div style="width: 40%" class="row left-block justify-around pb-5 pt-6">
        <div
          class="justify-center items-start row"
          style="width: 50px; height: 34px"
          v-for="(item, index) in awailableButtons.filter(
            (v, index) => index < 2
          )"
          :key="index"
        >
          <CButton
            :icon="item.icon"
            icon-no-gutters
            content-column
            text-button
            :label="item.label"
            @click.capture="item.click ? item.click() : undefined"
            :text-color="item.textColor()"
            icon-size="23px"
            text-size="10px"
            height="34px"
            color="transparent"
            hover-text-color="primary"
          />
        </div>
      </div>

      <div style="width: 40%" class="row right-block justify-around pb-5 pt-6">
        <div
          class="justify-center items-start row"
          style="width: 50px; height: 34px"
          v-for="(item, index) in awailableButtons.filter(
            (v, index) => index > 1
          )"
          :key="index"
        >
          <CButton
            :icon="item.icon"
            icon-no-gutters
            content-column
            text-button
            :label="item.label"
            @click.capture="item.click ? item.click() : undefined"
            :text-color="item.textColor()"
            icon-size="23px"
            text-size="10px"
            height="34px"
            color="transparent"
            hover-text-color="primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CButton from 'src/components/template/buttons/CButton.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { BottomBarElementType } from 'src/models/uiSettings/uiSettings'
import { store } from 'src/models/store'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { route } from 'quasar/wrappers'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'

const router = useRouter()

const awailableButtons = computed(() => {
  return buttons.value.filter((v) =>
    uiSettingsRepo.item?.bottomBarElements
      .map((el) => el.semantic_label)
      .includes(v.semanticLabel)
  )
})

const buttons = computed(
  (): {
    label: string
    semanticLabel: BottomBarElementType
    icon: string
    click: () => void
    textColor: () => string
  }[] => {
    return [
      {
        label: 'Главная',
        semanticLabel: 'home',
        icon: 'fa-light fa-house',
        click: () => {
          closeDialogs()
          void router.push({ name: 'home' })
        },
        textColor: () => {
          return route.name === 'home' ? 'primary' : 'on-bottom-menu-color'
        },
      },
      {
        label: 'Заказать',
        semanticLabel: 'arrange',
        icon: 'fa-light fa-store ',
        click: () => {
          closeDialogs()
          openDialog()
        },
        textColor: () => {
          return store.serviceSettingsModal || store.selectCompanyModal
            ? 'primary'
            : 'on-bottom-menu-color'
        },
      },
      {
        label: 'Корзина',
        semanticLabel: 'cart',
        icon: 'fa-light fa-cart-shopping ',
        click: () => {
          if (!authentication.user) {
            store.authModal = true
            return
          }
          store.cartDrawer = !store.cartDrawer
        },
        textColor: () => {
          return store.cartDrawer ? 'primary' : 'on-bottom-menu-color'
        },
      },
      {
        label: 'О нас',
        semanticLabel: 'company_profile',
        icon: 'fa-light fa-building ',
        click: () => {
          closeDialogs()
          if (!authentication.user) {
            store.authModal = true
            return
          }
          void router.push({
            name: 'aboutUs',
          })
        },
        textColor: () => {
          return route.name === 'aboutUs' ? 'primary' : 'on-bottom-menu-color'
        },
      },
      {
        label: 'Профиль',
        icon: 'fa-light fa-user',
        semanticLabel: 'profile',
        click: () => {
          closeDialogs()
          if (!authentication.user) {
            store.authModal = true
            return
          }
          void router.push({
            name: 'profilePage',
          })
        },
        textColor: () => {
          return route.name === 'profilePage'
            ? 'primary'
            : 'on-bottom-menu-color'
        },
      },
    ]
  }
)

const openQrPage = () => {
  if (!authentication.user) {
    store.authModal = true
    return
  }
  void router.push({
    name: 'myQrPage',
  })
}

const closeDialogs = () => {
  store.cartDrawer = false
  store.selectCompanyModal = false
  store.serviceSettingsModal = false
}

const openDialog = () => {
  if (!authentication.user) {
    store.authModal = true
    return
  }
  closeDialogs()
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.companies.length > 1) {
    store.selectCompanyModal = true
  } else {
    store.serviceSettingsModal = true
  }
}
</script>

<style lang="scss" scoped>
.qr-block {
  z-index: 9999;
  border-radius: 50%;
  min-width: 66px;
  max-width: 66px;
  max-height: 66px;
  min-height: 66px;
  margin-top: -28px;
  margin-bottom: 23px;
}

.kek {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 56px;
  z-index: 1;
  clip-path: polygon(
    0 0,
    calc(50% - 38px) 0,
    calc(50% - 37.487665px) 0.628287px,
    calc(50% - 36.975331px) 1.256382px,
    calc(50% - 36.462997px) 1.884094px,
    calc(50% - 35.912306px) 2.511233px,
    calc(50% - 35.863009px) 3.137607px,
    calc(50% - 35.802788px) 3.763025px,
    calc(50% - 35.731661px) 4.387296px,
    calc(50% - 35.64965px) 5.010232px,
    calc(50% - 35.55678px) 5.631641px,
    calc(50% - 35.453079px) 6.251334px,
    calc(50% - 35.338579px) 6.869124px,
    calc(50% - 35.213314px) 7.484821px,
    calc(50% - 35.077322px) 8.098238px,
    calc(50% - 34.930646px) 8.709188px,
    calc(50% - 34.77333px) 9.317486px,
    calc(50% - 34.605421px) 9.922945px,
    calc(50% - 34.426971px) 10.525381px,
    calc(50% - 34.238035px) 11.124612px,
    calc(50% - 34.038669px) 11.720454px,
    calc(50% - 33.828934px) 12.312725px,
    calc(50% - 33.608895px) 12.901246px,
    calc(50% - 33.378619px) 13.485837px,
    calc(50% - 33.138175px) 14.066321px,
    calc(50% - 32.887636px) 14.642519px,
    calc(50% - 32.62708px) 15.214257px,
    calc(50% - 32.356586px) 15.781361px,
    calc(50% - 32.076235px) 16.343658px,
    calc(50% - 31.786113px) 16.900976px,
    calc(50% - 31.486309px) 17.453146px,
    calc(50% - 31.176915px) 18px,
    calc(50% - 30.858023px) 18.541371px,
    calc(50% - 30.529731px) 19.077094px,
    calc(50% - 30.19214px) 19.607005px,
    calc(50% - 29.845353px) 20.130945px,
    calc(50% - 29.489474px) 20.648752px,
    calc(50% - 29.124612px) 21.160269px,
    calc(50% - 28.750878px) 21.665341px,
    calc(50% - 28.368387px) 22.163813px,
    calc(50% - 27.977255px) 22.655534px,
    calc(50% - 27.5776px) 23.140354px,
    calc(50% - 27.169545px) 23.618125px,
    calc(50% - 26.753214px) 24.088702px,
    calc(50% - 26.328733px) 24.551941px,
    calc(50% - 25.896233px) 25.007701px,
    calc(50% - 25.455844px) 25.455844px,
    calc(50% - 25.007701px) 25.896233px,
    calc(50% - 24.551941px) 26.328733px,
    calc(50% - 24.088702px) 26.753214px,
    calc(50% - 23.618125px) 27.169545px,
    calc(50% - 23.140354px) 27.5776px,
    calc(50% - 22.655534px) 27.977255px,
    calc(50% - 22.163813px) 28.368387px,
    calc(50% - 21.665341px) 28.750878px,
    calc(50% - 21.160269px) 29.124612px,
    calc(50% - 20.648752px) 29.489474px,
    calc(50% - 20.130945px) 29.845353px,
    calc(50% - 19.607005px) 30.19214px,
    calc(50% - 19.077094px) 30.529731px,
    calc(50% - 18.541371px) 30.858023px,
    calc(50% - 18px) 31.176915px,
    calc(50% - 17.453146px) 31.486309px,
    calc(50% - 16.900976px) 31.786113px,
    calc(50% - 16.343658px) 32.076235px,
    calc(50% - 15.781361px) 32.356586px,
    calc(50% - 15.214257px) 32.62708px,
    calc(50% - 14.642519px) 32.887636px,
    calc(50% - 14.066321px) 33.138175px,
    calc(50% - 13.485837px) 33.378619px,
    calc(50% - 12.901246px) 33.608895px,
    calc(50% - 12.312725px) 33.828934px,
    calc(50% - 11.720454px) 34.038669px,
    calc(50% - 11.124612px) 34.238035px,
    calc(50% - 10.525381px) 34.426971px,
    calc(50% - 9.922945px) 34.605421px,
    calc(50% - 9.317486px) 34.77333px,
    calc(50% - 8.709188px) 34.930646px,
    calc(50% - 8.098238px) 35.077322px,
    calc(50% - 7.484821px) 35.213314px,
    calc(50% - 6.869124px) 35.338579px,
    calc(50% - 6.251334px) 35.453079px,
    calc(50% - 5.631641px) 35.55678px,
    calc(50% - 5.010232px) 35.64965px,
    calc(50% - 4.387296px) 35.731661px,
    calc(50% - 3.763025px) 35.802788px,
    calc(50% - 3.137607px) 35.863009px,
    calc(50% - 2.511233px) 35.912306px,
    calc(50% - 1.884094px) 35.950663px,
    calc(50% - 1.256382px) 35.97807px,
    calc(50% - 0.628287px) 35.994517px,
    50% 36px,
    calc(50% + 0.628287px) 35.994517px,
    calc(50% + 1.256382px) 35.97807px,
    calc(50% + 1.884094px) 35.950663px,
    calc(50% + 2.511233px) 35.912306px,
    calc(50% + 3.137607px) 35.863009px,
    calc(50% + 3.763025px) 35.802788px,
    calc(50% + 4.387296px) 35.731661px,
    calc(50% + 5.010232px) 35.64965px,
    calc(50% + 5.631641px) 35.55678px,
    calc(50% + 6.251334px) 35.453079px,
    calc(50% + 6.869124px) 35.338579px,
    calc(50% + 7.484821px) 35.213314px,
    calc(50% + 8.098238px) 35.077322px,
    calc(50% + 8.709188px) 34.930646px,
    calc(50% + 9.317486px) 34.77333px,
    calc(50% + 9.922945px) 34.605421px,
    calc(50% + 10.525381px) 34.426971px,
    calc(50% + 11.124612px) 34.238035px,
    calc(50% + 11.720454px) 34.038669px,
    calc(50% + 12.312725px) 33.828934px,
    calc(50% + 12.901246px) 33.608895px,
    calc(50% + 13.485837px) 33.378619px,
    calc(50% + 14.066321px) 33.138175px,
    calc(50% + 14.642519px) 32.887636px,
    calc(50% + 15.214257px) 32.62708px,
    calc(50% + 15.781361px) 32.356586px,
    calc(50% + 16.343658px) 32.076235px,
    calc(50% + 16.900976px) 31.786113px,
    calc(50% + 17.453146px) 31.486309px,
    calc(50% + 18px) 31.176915px,
    calc(50% + 18.541371px) 30.858023px,
    calc(50% + 19.077094px) 30.529731px,
    calc(50% + 19.607005px) 30.19214px,
    calc(50% + 20.130945px) 29.845353px,
    calc(50% + 20.648752px) 29.489474px,
    calc(50% + 21.160269px) 29.124612px,
    calc(50% + 21.665341px) 28.750878px,
    calc(50% + 22.163813px) 28.368387px,
    calc(50% + 22.655534px) 27.977255px,
    calc(50% + 23.140354px) 27.5776px,
    calc(50% + 23.618125px) 27.169545px,
    calc(50% + 24.088702px) 26.753214px,
    calc(50% + 24.551941px) 26.328733px,
    calc(50% + 25.007701px) 25.896233px,
    calc(50% + 25.455844px) 25.455844px,
    calc(50% + 25.896233px) 25.007701px,
    calc(50% + 26.328733px) 24.551941px,
    calc(50% + 26.753214px) 24.088702px,
    calc(50% + 27.169545px) 23.618125px,
    calc(50% + 27.5776px) 23.140354px,
    calc(50% + 27.977255px) 22.655534px,
    calc(50% + 28.368387px) 22.163813px,
    calc(50% + 28.750878px) 21.665341px,
    calc(50% + 29.124612px) 21.160269px,
    calc(50% + 29.489474px) 20.648752px,
    calc(50% + 29.845353px) 20.130945px,
    calc(50% + 30.19214px) 19.607005px,
    calc(50% + 30.529731px) 19.077094px,
    calc(50% + 30.858023px) 18.541371px,
    calc(50% + 31.176915px) 18px,
    calc(50% + 31.486309px) 17.453146px,
    calc(50% + 31.786113px) 16.900976px,
    calc(50% + 32.076235px) 16.343658px,
    calc(50% + 32.356586px) 15.781361px,
    calc(50% + 32.62708px) 15.214257px,
    calc(50% + 32.887636px) 14.642519px,
    calc(50% + 33.138175px) 14.066321px,
    calc(50% + 33.378619px) 13.485837px,
    calc(50% + 33.608895px) 12.901246px,
    calc(50% + 33.828934px) 12.312725px,
    calc(50% + 34.038669px) 11.720454px,
    calc(50% + 34.238035px) 11.124612px,
    calc(50% + 34.426971px) 10.525381px,
    calc(50% + 34.605421px) 9.922945px,
    calc(50% + 34.77333px) 9.317486px,
    calc(50% + 34.930646px) 8.709188px,
    calc(50% + 35.077322px) 8.098238px,
    calc(50% + 35.213314px) 7.484821px,
    calc(50% + 35.338579px) 6.869124px,
    calc(50% + 35.453079px) 6.251334px,
    calc(50% + 35.55678px) 5.631641px,
    calc(50% + 35.64965px) 5.010232px,
    calc(50% + 35.731661px) 4.387296px,
    calc(50% + 35.802788px) 3.763025px,
    calc(50% + 35.863009px) 3.137607px,
    calc(50% + 35.912306px) 2.511233px,
    calc(50% + 36.462997px) 1.884094px,
    calc(50% + 36.975331px) 1.256382px,
    calc(50% + 37.487665px) 0.628287px,
    calc(50% + 38px) 0,
    100% 0,
    100% 100%,
    0 100%
  );
}
</style>
